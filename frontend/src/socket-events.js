/**
 * Socket.io event name constants
 * This file is shared between the frontend and backend to ensure consistency
 */
// Connection events
export const CONNECTION = 'connection';
export const DISCONNECT = 'disconnect';
export const CONNECT_ERROR = 'connect_error';
// Authentication events
export const AUTHENTICATE = 'authenticate';
export const USER = 'user';
export const ERROR = 'error';
export const ERROR_MESSAGE = 'error_message';
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
export var ErrorType;
(function (ErrorType) {
    ErrorType["NOT_LOGGED_IN"] = "not_logged_in";
    ErrorType["NOT_ADMIN"] = "not_admin";
    ErrorType["NOT_USER"] = "not_user";
    ErrorType["TOKEN"] = "token";
})(ErrorType || (ErrorType = {}));
// Room states
export var RoomState;
(function (RoomState) {
    RoomState["LOBBY"] = "lobby";
    RoomState["RESULTS"] = "results";
    RoomState["CLOSED"] = "closed";
})(RoomState || (RoomState = {}));
//# sourceMappingURL=socket-events.js.map