type MessageType =
  'CREATE_ACCOUNT' |
  'LOGIN' |
  'LOGOUT' |
  'TOKEN' |
  'GET_USERDATA' |
  'SEND_DATA' |
  'FIELD_LEVELUP' |
  'BUILDING_PLACE' |
  'BUILDING_LEVELUP' |
  'BUILDING_DELETE' |
  'EXPAND_TOWN' |
  'GET_MAP' |
  'SEND_MAP' |
  'GET_MAPSLOT' |
  'SEND_MAPSLOT' |
  'READ_INBOX' |
  'SEND_INBOX' |
  'CONFIRM_INBOX' |
  'DELETE_INBOX' |
  'ERROR'

export type Message =
  CreateAccountMessage |
  LoginMessage |
  LogoutMessage |
  TokenMessage |
  GetUserDataMessage |
  SendUserDataMessage |
  FieldLevelUpMessage |
  PlaceBuildingMessage |
  BuildingLevelUpMessage |
  DeleteBuildingMessage |
  ExpandTownMessage |
  GetMapMessage |
  SendMapMessage |
  GetMapSlotMessage |
  SendMapSlotMessage |
  SetInboxMessagesToReadMessage |
  SendInboxMessage |
  InboxConfirmMessage |
  DeleteInboxMessage |
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
  type: 'GET_USERDATA'
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
  fields: Array<Array<{name: string, level: number}>>
  buildings: Array<Array<{name: string, level: number}>>
  mapCoordinates: number[]
  inbox: InboxMessage[]
  timestamp: number
}

export interface FieldLevelUpMessage extends MessageBase {
  type: 'FIELD_LEVELUP'
  token: string
  row: number
  column: number
  newLevel: number
}

export interface PlaceBuildingMessage extends MessageBase {
  type: 'BUILDING_PLACE'
  token: string
  buildings: Array<Array<{name: string, level: number}>>
  newBuildingName: string
  moving: boolean
}

export interface BuildingLevelUpMessage extends MessageBase {
  type: 'BUILDING_LEVELUP'
  token: string
  row: number
  column: number
  newLevel: number
}

export interface DeleteBuildingMessage extends MessageBase {
  type: 'BUILDING_DELETE'
  token: string
  buildings: GridSlot[][]
  removedBuilding: GridSlot
}

export interface ExpandTownMessage extends MessageBase {
  type: 'EXPAND_TOWN'
  token: string
}

export interface GetMapMessage extends MessageBase {
  type: 'GET_MAP'
  token: string
}

export interface SendMapMessage extends MessageBase {
  type: 'SEND_MAP'
  map: string[][]
}

export interface GetMapSlotMessage extends MessageBase {
  type: 'GET_MAPSLOT'
  token: string
  username: string
}

export interface SendMapSlotMessage extends MessageBase {
  type: 'SEND_MAPSLOT'
  population: number
}

export interface SetInboxMessagesToReadMessage extends MessageBase {
  type: 'READ_INBOX'
  token: string
  inboxIndexes: number[]
}

export interface SendInboxMessage extends MessageBase {
  type: 'SEND_INBOX'
  token: string
  inboxMessage: InboxMessage
}

export interface InboxConfirmMessage extends MessageBase {
  type: 'CONFIRM_INBOX'
  successful: boolean
}

export interface ErrorMessage extends MessageBase {
  type: 'ERROR'
  message: string
}

export interface UserData {
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
  fields: Array<Array<{name: string, level: number}>>
  buildings: Array<Array<{name: string, level: number}>>
  mapCoordinates: number[]
  inbox: InboxMessage[]
  timestamp: number
}

export interface GridSlot {
  name: string
  level: number
}

export interface FieldSlot {
  populationGain: number
  lumberRateGain: number
  ironRateGain: number
  clayRateGain: number
  wheatRateGain: number
  lumberCost: number
  ironCost: number
  clayCost: number
  wheatCost: number
}

export interface BuildingSlot {
  populationGain: number
  lumberCost: number
  ironCost: number
  clayCost: number
  wheatCost: number
}

export interface MapSlot {
  population: number
}

export interface InboxMessage {
  sender: string
  title: string
  receiver: string
  message: string
  date: Date
  unread: boolean
}

export interface DeleteInboxMessage {
  type: 'DELETE_INBOX'
  token: string
  newMessageList: InboxMessage[]
}

export const fieldSlotData = {
  FOREST: {
    info: 'Everyone needs wood. Just remember to replant the trees so you do not run out. Increases lumber gain by',
    1: {populationGain: 1, lumberRateGain: 8,  ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 35,  ironCost: 60,  clayCost: 55,  wheatCost: 20},
    2: {populationGain: 1, lumberRateGain: 16, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 100, ironCost: 120, clayCost: 100, wheatCost: 85},
    3: {populationGain: 2, lumberRateGain: 23, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 170, ironCost: 210, clayCost: 220, wheatCost: 150}
  },
  CAVE: {
    info: 'From the darkest of caves the richest of iron minerals can be found. Increases iron gain by',
    1: {populationGain: 1, lumberRateGain: 0, ironRateGain: 8,  clayRateGain: 0, wheatRateGain: 0, lumberCost: 50,  ironCost: 30,  clayCost: 50,  wheatCost: 25},
    2: {populationGain: 1, lumberRateGain: 0, ironRateGain: 16, clayRateGain: 0, wheatRateGain: 0, lumberCost: 100, ironCost: 95,  clayCost: 120, wheatCost: 75},
    3: {populationGain: 2, lumberRateGain: 0, ironRateGain: 23, clayRateGain: 0, wheatRateGain: 0, lumberCost: 220, ironCost: 180, clayCost: 225, wheatCost: 145}
  },
  CLAY: {
    info: 'Flexible material. Good for making pots and other things made of clay. Increases clay gain by',
    1: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 8,  wheatRateGain: 0, lumberCost: 50,  ironCost: 45,  clayCost: 25,  wheatCost: 35},
    2: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 16, wheatRateGain: 0, lumberCost: 105, ironCost: 100, clayCost: 80,  wheatCost: 75},
    3: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 23, wheatRateGain: 0, lumberCost: 200, ironCost: 200, clayCost: 175, wheatCost: 130}
  },
  WHEAT: {
    info: 'Wheat is essential for keeping your people alive. Increases wheat gain by',
    1: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 10, lumberCost: 45,  ironCost: 45,  clayCost: 50,  wheatCost: 35},
    2: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 20, lumberCost: 95,  ironCost: 100, clayCost: 95,  wheatCost: 45},
    3: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 25, lumberCost: 200, ironCost: 210, clayCost: 205, wheatCost: 70}
  }
}

export const buildingsData = {
  'Test Building': {
    info: 'This is a testbuilding.',
    width: 2,
    height: 1,
    color: '#ebefec',
    level: {
      0: {},
      1: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 1'},
      2: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 2'},
      3: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 3'},
      4: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 4'},
      5: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 5'}
    }
  },
  Warehouse: {
    info: 'Increase the maximum capasity of your towns lumber, iron and clay.',
    width: 2,
    height: 1,
    color: '#8e6e63',
    level: {
      0: {maxLumber: 500,  maxIron: 500,  maxClay: 500},
      1: {populationGain: 1, lumberCost: 210,  ironCost: 180,  clayCost: 225,  wheatCost: 290,  info: 'Increases maximum capasity to 900',
          maxLumber: 900,  maxIron: 900,  maxClay: 900},
      2: {populationGain: 1, lumberCost: 450,  ironCost: 625,  clayCost: 580,  wheatCost: 450,  info: 'Increases maximum capasity to 1400',
          maxLumber: 1400, maxIron: 1400, maxClay: 1400},
      3: {populationGain: 2, lumberCost: 900,  ironCost: 875,  clayCost: 1050, wheatCost: 700,  info: 'Increases maximum capasity to 2000',
          maxLumber: 2000, maxIron: 2000, maxClay: 2000},
      4: {populationGain: 2, lumberCost: 1480, ironCost: 1800, clayCost: 1675, wheatCost: 1280, info: 'Increases maximum capasity to 3000',
          maxLumber: 3000, maxIron: 3000, maxClay: 3000},
      5: {populationGain: 2, lumberCost: 2725, ironCost: 2550, clayCost: 2700, wheatCost: 1875, info: 'Increases maximum capasity to 5000',
          maxLumber: 5000, maxIron: 5000, maxClay: 5000}
    }
  },
  Granary: {
    info: 'Increase the maximum capasity of your towns wheat.',
    width: 1,
    height: 1,
    color: '#f7f788bb',
    level: {
      0: {maxWheat: 500},
      1: {populationGain: 1, lumberCost: 180,  ironCost: 195,  clayCost: 200,  wheatCost: 150,  info: 'Increases maximum capasity to 900',  maxWheat: 900},
      2: {populationGain: 1, lumberCost: 460,  ironCost: 500,  clayCost: 500,  wheatCost: 520,  info: 'Increases maximum capasity to 1400', maxWheat: 1400},
      3: {populationGain: 1, lumberCost: 850,  ironCost: 875,  clayCost: 925,  wheatCost: 640,  info: 'Increases maximum capasity to 2000', maxWheat: 2000},
      4: {populationGain: 2, lumberCost: 1350, ironCost: 1275, clayCost: 1300, wheatCost: 1280, info: 'Increases maximum capasity to 3000', maxWheat: 3000},
      5: {populationGain: 2, lumberCost: 2150, ironCost: 2225, clayCost: 2200, wheatCost: 1750, info: 'Increases maximum capasity to 5000', maxWheat: 5000}
    }
  }
}

export const townExpansionData = {
  first: {
    lumberCost: 10,
    ironCost: 10,
    clayCost: 10,
    wheatCost: 10
  },
  second: {
    lumberCost: 10,
    ironCost: 10,
    clayCost: 10,
    wheatCost: 10
  }
}
