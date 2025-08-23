import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { User, Room, Question } from './models.js';
import * as db from './db.js';
import * as SocketEvents from './socket-events.js';
import { SocketEvents as SocketEventTypes, ErrorType, RoomState } from './socket-events.js';
import dotenv from 'dotenv';

// Load environment variables from .env file if it exists
dotenv.config();
if (process.env.JWT_SHARED_SECRET === undefined) {
  throw new Error('JWT_SHARED_SECRET is not defined');
}

import pkg from 'sequelize';
const { Op } = pkg;

const app = express();
const urlencodeParser = express.urlencoded({ extended: false });
const server = http.createServer(app);
const io = new Server<
  SocketEventTypes.ClientToServerEvents,
  SocketEventTypes.ServerToClientEvents
>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

app.post(
  '/api/login',
  urlencodeParser,
  (req: express.Request, res: express.Response) => {
    res.send(
      `<script>localStorage.setItem('jwt', '${req.body.jwt}');window.location='/';</script>`
    );
  }
);

app.get('/api/course', (_req: express.Request, res: express.Response) => {
  db.getCourseList().then((result) => {
    res.json(result);
  });
});

app.get('/api/course/:name', (req: express.Request, res: express.Response) => {
  db.getCourseDetail(req.params.name).then((result) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  }).catch((error) => {
    console.error(`[${new Date().toISOString()}] Error fetching course detail for ${req.params.name}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  });
});

let rooms: { [key: string]: Room } = {};

io.on(SocketEvents.CONNECTION, (socket) => {
  console.log(`[${new Date().toISOString()}] New socket connection: ${socket.id}`);

  // give room list
  socket.emit(SocketEvents.ROOMS, Object.keys(rooms));
  console.log(`[${new Date().toISOString()}] Sent rooms list to socket ${socket.id}`);

  let user: User;

  // Permission check helper functions
  function requireLogin(): boolean {
    if (!user) {
      socket.emit(SocketEvents.ERROR, { type: ErrorType.NOT_LOGGED_IN });
      return false;
    }
    return true;
  }

  function requireAdmin(): boolean {
    if (!requireLogin()) return false;

    if (!user.isAdmin) {
      socket.emit(SocketEvents.ERROR, { type: ErrorType.NOT_ADMIN });
      return false;
    }
    return true;
  }

  function requireNonAdmin(): boolean {
    if (!requireLogin()) return false;

    if (user.isAdmin) {
      socket.emit(SocketEvents.ERROR, { type: ErrorType.NOT_USER });
      return false;
    }
    return true;
  }

  socket.on(SocketEvents.LEAVE_ROOM, (roomName) => {
    handleLeaveRoom(roomName);
  });

  socket.on(SocketEvents.AUTHENTICATE, (token) => {
    handleToken(token);
  });

  socket.on(SocketEvents.JOIN_ROOM, (data) => {
    handleJoin(data);
  });

  socket.on(SocketEvents.LEAVE_ROOM, (data) => {
    handleLeave(data);
  });

  socket.on(SocketEvents.VOTE, (data) => {
    handleVote(data);
  });

  socket.on(SocketEvents.USER_AVATAR, (data) => {
    handleUserAvatar(data);
  });

  socket.on(SocketEvents.CREATE_ROOM, (data) => {
    handleCreateRoom(data);
  });

  socket.on(SocketEvents.ADD_QUESTION, (data) => {
    handleAddQuestion(data);
  });

  socket.on(SocketEvents.SET_STATE, (data) => {
    handleSetState(data);
  });

  socket.on(SocketEvents.CLOSE_ROOM, (data) => {
    handleCloseRoom(data);
  });

  // Handler implementations
  function handleLeaveRoom(roomName: string) {
    console.log(`[${new Date().toISOString()}] Socket ${socket.id} leaving room: ${roomName}`);
    if (!user?.isAdmin && rooms.hasOwnProperty(roomName)) {
      rooms[roomName].leaveVoters(user);
    }
    io.to(roomName).emit(SocketEvents.VOTER_LEFT, user?.email);
  }

  async function handleToken(token: string) {
    console.log(`[${new Date().toISOString()}] Received token event from socket ${socket.id}`);
    console.log(`[${new Date().toISOString()}] Token data: ${token ? 'provided' : 'missing'}`);

    try {
      user = await User.fromToken(token);
      console.log(`[${new Date().toISOString()}] User authenticated: ${user.email}`);
      socket.emit(SocketEvents.USER, user);
    } catch (e) {
      console.error(`[${new Date().toISOString()}] Token error: `, e);
      socket.emit(SocketEvents.ERROR, { type: ErrorType.TOKEN, error: e });
    }
  }

  function handleJoin(roomName: string) {
    console.log(`[${new Date().toISOString()}] Socket ${socket.id} joining room: ${roomName}`);
    if (!requireLogin()) {
      console.log(`[${new Date().toISOString()}] Join failed: user not logged in`);
      return;
    }

    const normalizedRoomName = roomName.replace(/ /g, '-');
    const roomAdminName = `${normalizedRoomName}-admin`;
    const room = rooms[normalizedRoomName];

    if (!room) {
      // make client exit not existing room
      return socket.emit('close');
    }

    // Join the room
    socket.join(normalizedRoomName);

    // Send room info
    socket.emit(SocketEvents.ROOM, room.getFilteredRoom());

    if (user.isAdmin) {
      socket.join(roomAdminName);
      // send full room with list of question to admin
      socket.emit(SocketEvents.ROOM, room);
      // since not included in full room send it
      socket.emit(SocketEvents.QUESTIONS_COUNT, room.questions.length);
    } else {
      room.joinVoters(user);
      io.to(normalizedRoomName).emit(SocketEvents.VOTER_JOIN, user);
      socket.emit(SocketEvents.USER_ANSWERS, room.getUserAnswers(user));
    }

    // restore state send current question or results info missing in room we sent (refactor?)
    const currentQuestion = room.getCurrentQuestion();
    if (currentQuestion) {
      socket.emit(SocketEvents.STATE, {
        state: room.state,
        question: currentQuestion.getFiltered(),
      });
    }
    if (room.state === RoomState.RESULTS) {
      socket.emit(SocketEvents.STATE, {
        state: RoomState.RESULTS,
        results: room.results()
      });
    }
    return;
  }

  function handleLeave(roomName: string) {
    if (!requireLogin()) return;

    const normalizedRoomName = roomName.replace(/ /g, '-');
    const roomAdminName = `${normalizedRoomName}-admin`;

    socket.leave(normalizedRoomName);
    if (user.isAdmin) {
      socket.leave(roomAdminName);
    }
  }

  function handleVote(data: SocketEvents.VoteData) {
    if (!requireNonAdmin()) return;

    const roomName = data.room.replace(/ /g, '-');
    const roomAdminName = `${roomName}-admin`;
    const room = rooms[roomName];

    if (!room) return;

    let question = room.getCurrentQuestion();
    if (question && !question.stop) {
      question.answer(user, data.vote);
      room.addParticipant(user);
      // refactor? if missing voter from disconnect
      if (!room.voters.hasOwnProperty(user.email)) {
        room.joinVoters(user);
        io.to(roomName).emit(SocketEvents.VOTER_JOIN, user);
      }
      io.to(roomName).emit(SocketEvents.VOTES_COUNT, {
        q: room.questions.indexOf(question),
        v: question.votesCount()
      });
      io.to(roomAdminName).emit(SocketEvents.VOTE, {
        u: user.email,
        v: data.vote,
        q: room.questions.indexOf(question),
      });
    }
  }

  function handleUserAvatar(data: SocketEvents.AvatarData) {
    if (!requireLogin()) return;

    const roomName = data.room.replace(/ /g, '-');
    const room = rooms[roomName];
    if (!room) return;

    room.voters[user.email].avatar = data.avatar;
    io.to(roomName).emit(SocketEvents.USER_AVATAR_UPDATE, {
      v: data.avatar,
      u: user.email
    });
  }

  function handleCreateRoom(data: SocketEvents.CreateRoomData) {
    if (!requireAdmin()) return;

    const roomName = data.name.replace(/ /g, '-');
    if (rooms.hasOwnProperty(roomName)) {
      return;
    }

    const room = new Room(roomName);
    room.owner = user;
    room.course = data.course;
    rooms[roomName] = room;
    room.save().then(() => {
      // send new room list to everybody
      io.emit(SocketEvents.ROOMS, Object.keys(rooms));
    });
  }

  function handleAddQuestion(data: SocketEvents.AddQuestionData) {
    if (!requireAdmin()) return;

    const roomName = data.room.replace(/ /g, '-');
    const roomAdminName = `${roomName}-admin`;
    const room = rooms[roomName];

    if (!room || !data.question) {
      return;
    }

    let question = new Question(data.question);
    question.index = room.questions.push(question) - 1;
    question.save(room).then(() => {
      // Only send the update after the question is properly saved with an ID
      io.to(roomAdminName).emit(SocketEvents.QUESTIONS, room.questions);
      io.to(roomName).emit(SocketEvents.QUESTIONS_COUNT, room.questions.length);
    });
  }

  function handleSetState(data: SocketEvents.StateChangeData) {
    if (!requireAdmin()) return;

    const roomName = data.room.replace(/ /g, '-');
    const roomAdminName = `${roomName}-admin`;
    const room = rooms[roomName];

    if (!room || !data.state) {
      return;
    }

    let question = room.getCurrentQuestion();
    // stop active question if votes > 0 or setting same question again (= showing answers even without votes)
    if (
      question &&
      !question.stop &&
      (Object.keys(question.votes).length > 0 || data.state === room.state)
    ) {
      question.stop = new Date();
      question.save(room);  // This doesn't need to block further processing
    }

    if (data.state === RoomState.LOBBY) {
      room.state = RoomState.LOBBY;
      room.save().then(() => {
        io.to(roomName).emit(SocketEvents.STATE, { state: RoomState.LOBBY });
      });
    } else if (data.state.indexOf('q') === 0) {
      room.state = data.state;
      room.save().then(() => {
        question = room.getCurrentQuestion();
        if (question && (!question.stop || data.reset)) {
          question.start = new Date();
          question.stop = undefined;
          question.votes = {};
          question.save(room).then(() => {
            io.to(roomAdminName).emit(SocketEvents.QUESTIONS, room.questions);
            io.to(roomName).emit(SocketEvents.STATE, {
              state: data.state,
              question: question?.getFiltered(),
              reset: data.reset,
            });
          });
        } else {
          io.to(roomName).emit(SocketEvents.STATE, {
            state: data.state,
            question: question?.getFiltered(),
            reset: data.reset,
          });
        }
      });
    } else if (data.state === RoomState.RESULTS) {
      room.state = RoomState.RESULTS;
      room.save().then(() => {
        io.to(roomName).emit(SocketEvents.STATE, {
          state: RoomState.RESULTS,
          results: room.results()
        });
      });
    }
  }

  function handleCloseRoom(roomName: string) {
    if (!requireAdmin()) return;

    const normalizedRoomName = roomName.replace(/ /g, '-');
    const room = rooms[normalizedRoomName];

    if (!room) {
      return;
    }

    room.state = RoomState.CLOSED;
    room.save().then(() => {
      delete rooms[normalizedRoomName];
      io.to(normalizedRoomName).emit('close');
      // send new room list to everybody
      io.emit(SocketEvents.ROOMS, Object.keys(rooms));
    });
  }
});

db.ready.then(() => {
  db.Session.findAll({
    where: {
      state: {
        [Op.ne]: RoomState.CLOSED,
      },
    },
    include: [
      { model: db.User, as: 'owner' },
      {
        model: db.Question,
        as: 'questions',
        include: [
          { model: db.Answer, as: 'answers' },
          {
            model: db.Vote,
            as: 'votes',
            include: [{ model: db.User, as: 'user' }],
          },
        ],
      },
    ],
  }).then((roomsData) => {
    roomsData.forEach((roomData: any) => {
      let room = new Room(roomData.name);
      room.id = roomData.id;
      room.state = roomData.state;
      room.course = roomData.course;
      room.created = roomData.created;
      room.owner = roomData.owner;
      roomData.questions.forEach((questionData: any) => {
        let answers = [] as any[];
        questionData.answers.forEach((answer: any) => {
          answers[answer.index] = answer;
        });
        let question = new Question({
          content: questionData.content,
          answers: answers,
        });
        question.id = questionData.id;
        question.index = questionData.index;
        question.start = questionData.start;
        question.stop = questionData.stop;

        questionData.votes.forEach((vote: any) => {
          question.votes[vote.user.email] = vote.answer.split(',').map((e: string) => {
            return parseInt(e, 10);
          });
          room.participants[vote.user.email] = vote.user;
        });
        room.questions[question.index] = question;
      });

      rooms[room.name] = room;
    });
    server.listen(3033, () => {
      console.log(`[${new Date().toISOString()}] Server listening on port 3033`);
    });
  });
}).catch((err) => {
  console.error(err);
});
