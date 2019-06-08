type MessageType =
  'CREATE_ACCOUNT' |
  'LOGIN' |
  'LOGOUT' |
  'TOKEN' |
  'GET_DATA' |
  'SEND_DATA' |
  'FIELD_LEVELUP' |
  'BUILDING_PLACE' |
  'BUILDING_LEVELUP' |
  'BUILDING_DELETE' |
  'EXPAND_TOWN' |
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
  fields: {name: string, level: number}[][]
  buildings: {name: string, level: number}[][]
  map: number[]
  inbox: {sender: string, title: string, message: string}[]
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
  buildings: {name: string, level: number}[][]
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
  fields: {name: string, level: number}[][]
  buildings: {name: string, level: number}[][]
  map: number[]
  inbox: {sender: string, title: string, message: string}[]
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

export const fieldSlotData = {
  'FOREST': {
    upgradeText: 'Everyone needs wood. Just remember to replant the trees so you do not run out. Increases lumber gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 8,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 35,
      ironCost: 60,
      clayCost: 55,
      wheatCost: 20
    },
    2: {
      populationGain: 1,
      lumberRateGain: 16,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 100,
      ironCost: 120,
      clayCost: 100,
      wheatCost: 85
    },
    3: {
      populationGain: 2,
      lumberRateGain: 23,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 170,
      ironCost: 210,
      clayCost: 220,
      wheatCost: 150
    }
  },
  'CAVE': {
    upgradeText: 'From the darkest of caves the richest of iron minerals can be found. Increases iron gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 8,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 50,
      ironCost: 30,
      clayCost: 50,
      wheatCost: 25
    },
    2: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 16,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 100,
      ironCost: 95,
      clayCost: 120,
      wheatCost: 75
    },
    3: {
      populationGain: 2,
      lumberRateGain: 0,
      ironRateGain: 23,
      clayRateGain: 0,
      wheatRateGain: 0,
      lumberCost: 220,
      ironCost: 180,
      clayCost: 225,
      wheatCost: 145
    }
  },
  'CLAY': {
    upgradeText: 'Flexible material. Good for making pots and other things made of clay. Increases clay gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 8,
      wheatRateGain: 0,
      lumberCost: 50,
      ironCost: 45,
      clayCost: 25,
      wheatCost: 35
    },
    2: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 16,
      wheatRateGain: 0,
      lumberCost: 105,
      ironCost: 100,
      clayCost: 80,
      wheatCost: 75
    },
    3: {
      populationGain: 2,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 23,
      wheatRateGain: 0,
      lumberCost: 200,
      ironCost: 200,
      clayCost: 175,
      wheatCost: 130
    }
  },
  'WHEAT': {
    upgradeText: 'Wheat is essential for keeping your people alive. Increases wheat gain by',
    1: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 10,
      lumberCost: 45,
      ironCost: 45,
      clayCost: 50,
      wheatCost: 35
    },
    2: {
      populationGain: 1,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 20,
      lumberCost: 95,
      ironCost: 100,
      clayCost: 95,
      wheatCost: 45
    },
    3: {
      populationGain: 2,
      lumberRateGain: 0,
      ironRateGain: 0,
      clayRateGain: 0,
      wheatRateGain: 25,
      lumberCost: 200,
      ironCost: 210,
      clayCost: 205,
      wheatCost: 70
    }
  }
}

export const buildingsData = {
  'Test Building 1': {
    info: 'This building is the first one to use in a testing.',
    width: 1,
    height: 1,
    populationGain: 1,
    lumberCost: 10,
    ironCost: 10,
    clayCost: 10,
    wheatCost: 10,
    upgrade: {
      1: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      },
      2: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      }
    }
  },
  'Test Building 2': {
    info: 'This building is the second one to use in a testing.',
    width: 1,
    height: 2,
    populationGain: 1,
    lumberCost: 10,
    ironCost: 10,
    clayCost: 10,
    wheatCost: 10,
    upgrade: {
      1: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      },
      2: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      }
    }
  },
  'Test Building 3': {
    info: 'This building is the third one to use in testing. It has extra long text. And oh boy, is it long! it is, indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something. indeed. Very much so! It really is quite something.',
    width: 2,
    height: 2,
    populationGain: 1,
    lumberCost: 10,
    ironCost: 10,
    clayCost: 10,
    wheatCost: 10,
    upgrade: {
      1: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      },
      2: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      }
    }
  },
  'Test Building 4': {
    info: 'And another one!',
    width: 3,
    height: 2,
    populationGain: 1,
    lumberCost: 10,
    ironCost: 10,
    clayCost: 10,
    wheatCost: 10,
    upgrade: {
      1: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      },
      2: {
        populationGain: 1,
        lumberCost: 10,
        ironCost: 10,
        clayCost: 10,
        wheatCost: 10
      }
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