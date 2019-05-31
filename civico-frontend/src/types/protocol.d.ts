type MessageType =
  'CREATE_ACCOUNT' |
  'LOGIN' |
  'LOGOUT' |
  'TOKEN' |
  'GET_DATA' |
  'SEND_DATA' |
  'FIELD_LEVELUP' |
  'ERROR'

export type Message =
  CreateAccountMessage |
  LoginMessage |
  LogoutMessage |
  TokenMessage |
  GetUserDataMessage |
  SendUserDataMessage |
  FieldLevelUpMessage |
  ErrorMessage

export interface MessageBase {
  type: MessageType
  token?: string
}

export interface CreateAccountMessage extends MessageBase {
  type: 'CREATE_ACCOUNT'
  username: string
  password: string
}

export interface LoginMessage extends MessageBase {
  type: 'LOGIN'
  username: string
  password: string
}

export interface LogoutMessage extends MessageBase {
  type: 'LOGOUT'
  token: string
}

export interface TokenMessage extends MessageBase {
  type: 'TOKEN'
  token: string
  username: string
}

export interface GetUserDataMessage extends MessageBase {
  type: 'GET_DATA'
  token: string
}

export interface SendUserDataMessage extends MessageBase {
  type: 'SEND_DATA'
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  fields: {
    name: string
    level: number
  }[][]
  buildings: {
    name: string
    level: number
  }[][]
  map: number[]
  inbox: {
    sender: string
    title: string
    message: string
  }[]
  timestamp: number
}

export interface FieldLevelUpMessage extends MessageBase {
  type: 'FIELD_LEVELUP'
  token: string
  row: number
  column: number
  newLevel: number
}

export interface ErrorMessage extends MessageBase {
  type: 'ERROR'
  message: string
}
