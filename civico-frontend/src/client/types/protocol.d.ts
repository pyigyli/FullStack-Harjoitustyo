type MessageType = 'CREATE_ACCOUNT' | 'LOGIN'

export type Message = CreateAccountMessage | LoginMessage

export interface MessageBase {
  type: MessageType
}

export interface Message {
  type: String,
  message: String
}

export interface CreateAccountMessage {
  type: 'CREATE_ACCOUNT',
  username: String,
  password: String
}

export interface LoginMessage {
  type: 'LOGIN',
  username: String,
  password: String
}