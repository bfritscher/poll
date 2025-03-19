/**
 * Socket.io event name constants
 * This file is shared between the frontend and backend to ensure consistency
 */

import type { Room, User, Question, Score } from './models.js';

// Connection events
export const CONNECTION = 'connection';
export const DISCONNECT = 'disconnect';
export const CONNECT_ERROR = 'connect_error';

// Authentication events
export const AUTHENTICATE = 'authenticate';
export const USER = 'user';
export const ERROR = 'error';

// Room events
export const JOIN_ROOM = 'join_room';
export const LEAVE_ROOM = 'leave_room';
export const CREATE_ROOM = 'create_room';
export const CLOSE_ROOM = 'close_room';
export const ROOMS = 'rooms';
export const ROOM = 'room';

// Question events
export const ADD_QUESTION = 'add_question';
export const QUESTIONS = 'questions';
export const QUESTIONS_COUNT = 'questions_count';

// State events
export const SET_STATE = 'set_state';
export const STATE = 'state';
export const VOTE = 'vote';
export const VOTES_COUNT = 'votes_count';

// User events
export const VOTER_JOIN = 'voter_join';
export const VOTER_LEFT = 'voter_left';
export const USER_AVATAR = 'set_avatar';
export const USER_AVATAR_UPDATE = 'user_avatar';
export const USER_ANSWERS = 'user_answers';

// Error types
export enum ErrorType {
  NOT_LOGGED_IN = 'not_logged_in',
  NOT_ADMIN = 'not_admin',
  NOT_USER = 'not_user',
  TOKEN = 'token'
}

// Room states
export enum RoomState {
  LOBBY = 'lobby',
  RESULTS = 'results',
  CLOSED = 'closed'
}

// Type definitions for event payloads which are not models
export interface ErrorPayload {
  type: ErrorType;
  message?: string;
  error?: any;
}

export interface VoteData {
  room: string;
  vote: number[];
}

export interface StateChangeData {
  room: string;
  state: string;
  reset?: boolean;
}

export interface StateUpdateData {
  state: string;
  question?: Question;
  results?: Score[];
  reset?: boolean;
}

export interface AvatarData {
  room: string;
  avatar: string;
}

export interface AvatarUpdateData {
  u: string; // user email
  v: string; // avatar value
}

export interface CreateRoomData {
  name: string;
  course?: string;
}

export interface AddQuestionData {
  room: string;
  question: Question;
}

export interface VoteCountData {
  q: number; // question index
  v: number; // vote count
}

export interface VoteUpdateData {
  u: string; // user email
  v: number[]; // vote values
  q: number; // question index
}

// Creating a namespace for the socket events to be used with Socket.io
export namespace SocketEvents {
  export interface ClientToServerEvents {
    [AUTHENTICATE]: (token: string) => void;
    [JOIN_ROOM]: (roomName: string) => void;
    [LEAVE_ROOM]: (roomName: string) => void;
    [CREATE_ROOM]: (data: CreateRoomData) => void;
    [CLOSE_ROOM]: (roomName: string) => void;
    [ADD_QUESTION]: (data: AddQuestionData) => void;
    [VOTE]: (data: VoteData) => void;
    [USER_AVATAR]: (data: AvatarData) => void;
    [SET_STATE]: (data: StateChangeData) => void;
  }

  export interface ServerToClientEvents {
    [USER]: (data: User) => void;
    [ERROR]: (data: ErrorPayload) => void;
    [ROOMS]: (rooms: string[]) => void;
    [ROOM]: (data: Room) => void;
    [QUESTIONS]: (questions: Question[]) => void;
    [QUESTIONS_COUNT]: (count: number) => void;
    [STATE]: (data: StateUpdateData) => void;
    [VOTER_JOIN]: (user: User) => void;
    [VOTER_LEFT]: (email: string) => void;
    [USER_AVATAR_UPDATE]: (data: AvatarUpdateData) => void;
    [USER_ANSWERS]: (answers: Record<number, number[]>) => void;
    [VOTES_COUNT]: (data: VoteCountData) => void;
    [VOTE]: (data: VoteUpdateData) => void;
    'close': () => void;
    'connect': () => void;
    [CONNECT_ERROR]: (err: Error) => void;
    [DISCONNECT]: () => void;
  }
}