type MessageType = 'CREATE_ACCOUNT' | 'LOGIN' | 'LOGOUT' | 'AUTHORIZE'

export type Message = CreateAccountMessage | LoginMessage | LogoutMessage | AuthorizeLoginMessage

export interface MessageBase {
  type: MessageType
  token?: string
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

export interface LogoutMessage extends MessageBase {
  type: 'LOGOUT',
  token: string
}

export interface AuthorizeLoginMessage extends MessageBase {
  type: 'AUTHORIZE',
  token: string
}
