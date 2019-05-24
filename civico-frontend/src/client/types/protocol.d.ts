type MessageType = 'CREATE_ACCOUNT' | 'LOGIN'

export type Message = CreateAccountMessage | LoginMessage

export interface MessageBase {
  type: MessageType
}

export interface Message {
  type: string,
  message: string
}

export interface CreateAccountMessage {
  type: 'CREATE_ACCOUNT',
  username: string,
  password: string
}

export interface LoginMessage {
  type: 'LOGIN',
  username: string,
  password: string
}