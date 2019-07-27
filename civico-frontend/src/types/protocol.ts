type MessageType =
  'CREATE_ACCOUNT' |
  'LOGIN' |
  'LOGOUT' |
  'TOKEN' |
  'GET_PROFILE' |
  'SEND_PROFILE' |
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
  'ERROR' |
  'PACIFISM' |
  'TRAIN_TROOPS' |
  'SEND_TROOPS'

export type Message =
  CreateAccountMessage |
  LoginMessage |
  LogoutMessage |
  TokenMessage |
  GetProfileMessage |
  SendProfileMessage |
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
  ErrorMessage |
  TogglePacifismMessage |
  TrainTroopsMessage |
  SendTroopsMessage

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

export interface GetProfileMessage extends MessageBase {
  type: 'GET_PROFILE'
  token: string
  username: string
}

export interface SendProfileMessage extends MessageBase {
  type: 'SEND_PROFILE'
  userProfile: UserProfile
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
  troops: Troops
  troopsOnMove: DispatchedTroops[]
  pacifist: boolean
  pacifismDisabledUntil: number
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
  username: string
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

export interface DeleteInboxMessage {
  type: 'DELETE_INBOX'
  token: string
  newMessageList: InboxMessage[]
}

export interface ErrorMessage extends MessageBase {
  type: 'ERROR'
  message: string
}

export interface TogglePacifismMessage extends MessageBase {
  type: 'PACIFISM'
  token: string
  pacifist: boolean
  disabledDays: number
}

export interface TrainTroopsMessage extends MessageBase {
  type: 'TRAIN_TROOPS'
  token: string
  troopType: string
  amountToTrain: number
}

export interface SendTroopsMessage extends MessageBase {
  type: 'SEND_TROOPS'
  token: string
  sender: string
  target: string | false
  troopsToSend: Troops
  travelTime: number
}

export interface UserData {
  username: string
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
  troops: Troops
  troopsOnMove: DispatchedTroops[]
  bio: string
  pacifist: boolean
  pacifismDisabledUntil: number
  timestamp: number
}

export interface UserProfile {
  username: string
  population: number
  bio: string
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
  username: string
  population: number
}

export interface InboxMessage {
  sender: string
  title: string
  receiver: string
  message: string[]
  date: number
  unread: boolean
}

export interface Troops {
  'Knife Boy': number
  Spearman: number
  Swordsman: number
  'Donkey Rider': number
  Jouster: number
  'Dark Knight': number
}

export interface DispatchedTroops {
  sender: string
  target: string | false
  troops: Troops
  headingBack: boolean
  stoleEachResource: number
  travelTime: number
  arrivalTime: number
}

export const fieldSlotData = {
  FOREST: {
    info: 'Everyone needs wood. Just remember to replant the trees so you do not run out. Increases lumber gain by',
    1: {populationGain: 1, lumberRateGain: 8,  ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 35,  ironCost: 60,  clayCost: 55,  wheatCost: 20},
    2: {populationGain: 1, lumberRateGain: 16, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 100, ironCost: 120, clayCost: 100, wheatCost: 85},
    3: {populationGain: 2, lumberRateGain: 23, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 170, ironCost: 210, clayCost: 220, wheatCost: 150},
    4: {populationGain: 2, lumberRateGain: 35, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 350, ironCost: 410, clayCost: 450, wheatCost: 230},
    5: {populationGain: 3, lumberRateGain: 50, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 0, lumberCost: 620, ironCost: 700, clayCost: 685, wheatCost: 350}
  },
  CAVE: {
    info: 'From the darkest of caves the richest of iron minerals can be found. Increases iron gain by',
    1: {populationGain: 1, lumberRateGain: 0, ironRateGain: 8,  clayRateGain: 0, wheatRateGain: 0, lumberCost: 50,  ironCost: 30,  clayCost: 50,  wheatCost: 25},
    2: {populationGain: 1, lumberRateGain: 0, ironRateGain: 16, clayRateGain: 0, wheatRateGain: 0, lumberCost: 100, ironCost: 95,  clayCost: 120, wheatCost: 75},
    3: {populationGain: 2, lumberRateGain: 0, ironRateGain: 23, clayRateGain: 0, wheatRateGain: 0, lumberCost: 220, ironCost: 180, clayCost: 225, wheatCost: 145},
    4: {populationGain: 2, lumberRateGain: 0, ironRateGain: 35, clayRateGain: 0, wheatRateGain: 0, lumberCost: 425, ironCost: 325, clayCost: 400, wheatCost: 230},
    5: {populationGain: 3, lumberRateGain: 0, ironRateGain: 50, clayRateGain: 0, wheatRateGain: 0, lumberCost: 675, ironCost: 625, clayCost: 690, wheatCost: 350}
  },
  CLAY: {
    info: 'Flexible material. Good for making pots and other things made of clay. Increases clay gain by',
    1: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 8,  wheatRateGain: 0, lumberCost: 50,  ironCost: 45,  clayCost: 25,  wheatCost: 35},
    2: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 16, wheatRateGain: 0, lumberCost: 105, ironCost: 100, clayCost: 80,  wheatCost: 75},
    3: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 23, wheatRateGain: 0, lumberCost: 200, ironCost: 200, clayCost: 175, wheatCost: 130},
    4: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 35, wheatRateGain: 0, lumberCost: 430, ironCost: 400, clayCost: 340, wheatCost: 230},
    5: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 50, wheatRateGain: 0, lumberCost: 680, ironCost: 700, clayCost: 620, wheatCost: 350}
  },
  WHEAT: {
    info: 'Wheat is essential for keeping your people alive. Increases wheat gain by',
    1: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 10, lumberCost: 45,  ironCost: 45,  clayCost: 50,  wheatCost: 35},
    2: {populationGain: 1, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 20, lumberCost: 95,  ironCost: 100, clayCost: 95,  wheatCost: 45},
    3: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 25, lumberCost: 200, ironCost: 210, clayCost: 205, wheatCost: 70},
    4: {populationGain: 2, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 40, lumberCost: 410, ironCost: 400, clayCost: 425, wheatCost: 180},
    5: {populationGain: 3, lumberRateGain: 0, ironRateGain: 0, clayRateGain: 0, wheatRateGain: 60, lumberCost: 625, ironCost: 600, clayCost: 650, wheatCost: 325}
  }
}

export const buildingsData = {
  'Test Building': {
    info: 'This is a testbuilding.',
    width: 2,
    height: 1,
    color: '#ebefec',
    requirements: {},
    level: {
      0: {},
      1: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 1'},
      2: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 2'},
      3: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 3'},
      4: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 4'},
      5: {populationGain: 1, lumberCost: 10, ironCost: 10, clayCost: 10, wheatCost: 10, info: 'Level 5'}
    }
  },
  'Town Hall': {
    info: 'Important decisions require important people. The mayor lives here, managing his town.',
    width: 2,
    height: 1,
    color: '#2cc2c2cc',
    requirements: {},
    level: {
      0: {},
      1: {populationGain: 1, lumberCost: 190,  ironCost: 210,  clayCost: 175,  wheatCost: 130},
      2: {populationGain: 2, lumberCost: 325,  ironCost: 300,  clayCost: 300,  wheatCost: 200},
      3: {populationGain: 2, lumberCost: 630,  ironCost: 650,  clayCost: 625,  wheatCost: 470},
      4: {populationGain: 3, lumberCost: 1500, ironCost: 1625, clayCost: 1540, wheatCost: 1350},
      5: {populationGain: 4, lumberCost: 3225, ironCost: 3020, clayCost: 3200, wheatCost: 2500}
    }
  },
  Warehouse: {
    info: 'Increases the maximum capasity of lumber, iron and clay.',
    width: 2,
    height: 1,
    color: '#8e6e63',
    requirements: {},
    level: {
      0: {maxLumber: 500,  maxIron: 500,  maxClay: 500},
      1: {populationGain: 1, lumberCost: 210,  ironCost: 180,  clayCost: 225,  wheatCost: 290,
          info: 'Increases the maximum capasity of lumber, iron and clay to 1400.', maxLumber: 900,  maxIron: 900,  maxClay: 900},
      2: {populationGain: 1, lumberCost: 450,  ironCost: 625,  clayCost: 580,  wheatCost: 450,
          info: 'Increases the maximum capasity of lumber, iron and clay to 2000.', maxLumber: 1400, maxIron: 1400, maxClay: 1400},
      3: {populationGain: 2, lumberCost: 900,  ironCost: 875,  clayCost: 1050, wheatCost: 700,
          info: 'Increases the maximum capasity of lumber, iron and clay to 3000.', maxLumber: 2000, maxIron: 2000, maxClay: 2000},
      4: {populationGain: 2, lumberCost: 1480, ironCost: 1800, clayCost: 1675, wheatCost: 1280,
          info: 'Increases the maximum capasity of lumber, iron and clay to 5000.', maxLumber: 3000, maxIron: 3000, maxClay: 3000},
      5: {populationGain: 2, lumberCost: 2725, ironCost: 2550, clayCost: 2700, wheatCost: 1875,
          info: 'Increases the maximum capasity of lumber, iron and clay.',         maxLumber: 5000, maxIron: 5000, maxClay: 5000}
    }
  },
  Granary: {
    info: 'Increases the maximum capasity of wheat.',
    width: 1,
    height: 1,
    color: '#f7f788bb',
    requirements: {},
    level: {
      0: {maxWheat: 500},
      1: {populationGain: 1, lumberCost: 180,  ironCost: 195,  clayCost: 200,  wheatCost: 150,  info: 'Increases the maximum capasity of wheat to 1400.', maxWheat: 900},
      2: {populationGain: 1, lumberCost: 460,  ironCost: 500,  clayCost: 500,  wheatCost: 520,  info: 'Increases the maximum capasity of wheat to 2000.', maxWheat: 1400},
      3: {populationGain: 1, lumberCost: 850,  ironCost: 875,  clayCost: 925,  wheatCost: 640,  info: 'Increases the maximum capasity of wheat to 3000.', maxWheat: 2000},
      4: {populationGain: 2, lumberCost: 1350, ironCost: 1275, clayCost: 1300, wheatCost: 1280, info: 'Increases the maximum capasity of wheat to 5000.', maxWheat: 3000},
      5: {populationGain: 2, lumberCost: 2150, ironCost: 2225, clayCost: 2200, wheatCost: 1750, info: 'Increases the maximum capasity of wheat.',         maxWheat: 5000}
    }
  },
  Embassy: {
    info: 'State the military status of your town here. Are you a pacifist or do you wanna war with others?',
    width: 1,
    height: 1,
    color: '#ff9030dd',
    requirements: {'Town Hall': 1},
    level: {
      0: {},
      1: {populationGain: 1, lumberCost: 110, ironCost: 95, clayCost: 125, wheatCost: 160,
          info: 'Lower the cooldown of restating your towns military status to 4 days.'},
      2: {populationGain: 1, lumberCost: 160, ironCost: 150, clayCost: 160, wheatCost: 200,
          info: 'Lower the cooldown of restating your towns military status to 3 days.'},
      3: {populationGain: 1, lumberCost: 230, ironCost: 250, clayCost: 225, wheatCost: 275,
          info: 'Lower the cooldown of restating your towns military status to 2 days.'},
      4: {populationGain: 1, lumberCost: 295, ironCost: 280, clayCost: 275, wheatCost: 300,
          info: 'Lower the cooldown of restating your towns military status to 1 days.'},
      5: {populationGain: 1, lumberCost: 425, ironCost: 390, clayCost: 400, wheatCost: 360,
          info: 'Lower the cooldown of restating your towns military status.'}
    }
  },
  Barracks: {
    info: 'Train your basic foot soldiers and improve your military strength.',
    width: 2,
    height: 2,
    color: '#48561fcc',
    requirements: {'Town Hall': 2, Embassy: 1},
    level: {
      0: {},
      1: {populationGain: 2, lumberCost: 245, ironCost: 210, clayCost: 225, wheatCost: 170, info: 'Lower the cost of training to 95%.'},
      2: {populationGain: 2, lumberCost: 260, ironCost: 260, clayCost: 225, wheatCost: 200, info: 'Lower the cost of training to 90%.'},
      3: {populationGain: 2, lumberCost: 325, ironCost: 330, clayCost: 350, wheatCost: 275, info: 'Lower the cost of training to 85%.'},
      4: {populationGain: 3, lumberCost: 380, ironCost: 350, clayCost: 400, wheatCost: 325, info: 'Lower the cost of training to 80%.'},
      5: {populationGain: 3, lumberCost: 500, ironCost: 500, clayCost: 500, wheatCost: 400, info: 'Lower the cost of training.'}
    }
  },
  Stable: {
    info: 'Horses give significant advantage in everything compared to basic foot soldiers. Train your horses and their riders in here.',
    width: 3,
    height: 2,
    color: '#8c6c3cee',
    requirements: {'Town Hall': 3, Barracks: 3},
    level: {
      0: {},
      1: {populationGain: 3, lumberCost: 575, ironCost: 510, clayCost: 550, wheatCost: 600, info: 'Lower the cost of training to 95%.'},
      2: {populationGain: 2, lumberCost: 600, ironCost: 575, clayCost: 580, wheatCost: 630, info: 'Lower the cost of training to 90%.'},
      3: {populationGain: 2, lumberCost: 650, ironCost: 650, clayCost: 650, wheatCost: 650, info: 'Lower the cost of training to 85%.'},
      4: {populationGain: 3, lumberCost: 680, ironCost: 700, clayCost: 660, wheatCost: 690, info: 'Lower the cost of training to 80%.'},
      5: {populationGain: 3, lumberCost: 700, ironCost: 740, clayCost: 700, wheatCost: 720, info: 'Lower the cost of training.'}
    }
  }
}

export const troopsData = {
  'Knife Boy':    {attack: 5,  defence: 3,  speed: 6,  capasity: 75,  lumberCost: 35,  ironCost: 20,  clayCost: 25,  wheatCost: 20},
  Spearman:       {attack: 7,  defence: 10, speed: 7,  capasity: 120, lumberCost: 50,  ironCost: 50,  clayCost: 40,  wheatCost: 25},
  Swordsman:      {attack: 15, defence: 6,  speed: 6,  capasity: 110, lumberCost: 90,  ironCost: 120, clayCost: 100, wheatCost: 50},
  'Donkey Rider': {attack: 10, defence: 12, speed: 12, capasity: 140, lumberCost: 130, ironCost: 145, clayCost: 150, wheatCost: 140},
  Jouster:        {attack: 15, defence: 15, speed: 16, capasity: 150, lumberCost: 165, ironCost: 180, clayCost: 165, wheatCost: 175},
  'Dark Knight':  {attack: 20, defence: 18, speed: 15, capasity: 175, lumberCost: 200, ironCost: 250, clayCost: 225, wheatCost: 200}
}

export const townExpansionData = {
  1: {
    lumberCost: 700,
    ironCost: 550,
    clayCost: 630,
    wheatCost: 660
  },
  2: {
    lumberCost: 2775,
    ironCost: 2700,
    clayCost: 2650,
    wheatCost: 1850
  }
}
