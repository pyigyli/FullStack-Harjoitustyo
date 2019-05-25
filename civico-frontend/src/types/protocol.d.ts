type MessageType = 'CREATE_ACCOUNT' | 'LOGIN' | 'AUTH'

export type Message = CreateAccountMessage | LoginMessage | AuthorizeLoginMessage

export interface MessageBase {
  type: MessageType
}

export interface CreateAccountMessage extends MessageBase {
  type: 'CREATE_ACCOUNT',
  username: string,
  password: string
}

export interface LoginMessage extends MessageBase {
  type: 'LOGIN',
  username: string,
  password: string
}

export interface AuthorizeLoginMessage extends MessageBase {
  type: 'AUTH',
  token: string
}