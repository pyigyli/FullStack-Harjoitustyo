type MessageType =
  'CREATE_ACCOUNT' |
  'LOGIN' |
  'LOGOUT' |
  'TOKEN' |
  'BASIC' |
  'TOWN' |
  'GET_FIELD' |
  'SEND_FIELD' |
  'GET_TOWN' |
  'SEND_TOWN' |
  'GET_MAP' |
  'SEND_MAP' |
  'GET_INBOX' |
  'SEND_INBOX' |
  'ERROR'

export type Message =
  CreateAccountMessage |
  LoginMessage |
  LogoutMessage |
  TokenMessage |
  BasicUserDataMessage |
  FieldRequestMessage |
  FieldResponseMessage |
  TownRequestMessage |
  TownResponseMessage |
  MapRequestMessage |
  MapResponseMessage |
  InboxRequestMessage |
  InboxResponseMessage |
  ErrorMessage

export type RequestDataMessageType = 'GET_FIELD' | 'GET_TOWN' | 'GET_MAP' | 'GET_INBOX'

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

export interface BasicUserDataMessage extends MessageBase {
  type: 'BASIC'
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
  fields: Object
  buildings: Object
}

export interface FieldRequestMessage extends MessageBase {
  type: 'GET_FIELD'
  token: string
}

export interface FieldResponseMessage extends MessageBase {
  type: 'SEND_FIELD'
  token?: string
  fieldGrid: string[][]
}

export interface TownRequestMessage extends MessageBase {
  type: 'GET_TOWN'
  token: string
}

export interface TownResponseMessage extends MessageBase {
  type: 'SEND_TOWN'
  token?: string
  townGrid: string[][]
}

export interface MapRequestMessage extends MessageBase {
  type: 'GET_MAP'
  token: string
}

export interface MapResponseMessage extends MessageBase {
  type: 'SEND_MAP'
  token?: string
  mapGrid: string[][]
}

export interface InboxRequestMessage extends MessageBase {
  type: 'GET_INBOX'
  token: string
}

export interface InboxResponseMessage extends MessageBase {
  type: 'SEND_INBOX'
  token?: string
}

export interface ErrorMessage extends MessageBase {
  type: 'ERROR'
  message: string
}
