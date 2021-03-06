import jwt from 'jsonwebtoken'
import Connection from './connection'
import {Message} from './types/protocol'
import {createNewAccount, deleteAccount, login, logout, getUserData, getUserProfile, changeBio} from './firebase/users'
import {levelUpField} from './firebase/fields'
import {placeBuilding, levelUpBuilding, deleteBuilding, expandTown} from './firebase/town'
import {getMap, getMapSlot} from './firebase/map'
import {setInboxMessagesToRead, sendInboxMessage, deleteInboxMessage} from './firebase/inbox'
import {togglePacifism, trainTroops, sendTroops} from './firebase/military'

class CivicoServer {
  private connections: Connection[] = []

  public handleMessage(conn: Connection, message: Message) {
    let id: string | null = null
    if (message.token) {
      id = this.verifyToken(message.token)
      if (!id) {
        return conn.sendMessage({type: 'TOKEN', token: '', username: ''})
      }
    }
    switch (message.type) {
      case 'CREATE_ACCOUNT':
        return this.createAccount(conn, message.username, message.password)
      case 'DELETE_ACCOUNT':
        return deleteAccount(conn)
      case 'LOGIN':
        return this.loginAccount(conn, message.username, message.password)
      case 'LOGOUT':
        return logout(conn)
      case 'GET_USERDATA':
        return getUserData(conn)
      case 'GET_PROFILE':
        return getUserProfile(conn, message.username)
      case 'CHANGE_BIO':
        return changeBio(conn, message.newBio)
      case 'FIELD_LEVELUP':
        return levelUpField(conn, message.row, message.column, message.newLevel)
      case 'BUILDING_PLACE':
        return placeBuilding(conn, message.buildings, message.newBuildingName, message.moving)
      case 'BUILDING_LEVELUP':
        return levelUpBuilding(conn, message.row, message.column, message.newLevel)
      case 'BUILDING_DELETE':
        return deleteBuilding(conn, message.buildings, message.removedBuilding)
      case 'EXPAND_TOWN':
        return expandTown(conn)
      case 'GET_MAP':
        return getMap(conn)
      case 'GET_MAPSLOT':
        return getMapSlot(conn, message.username)
      case 'READ_INBOX':
        return setInboxMessagesToRead(conn, message.inboxIndexes)
      case 'SEND_INBOX':
        return sendInboxMessage(conn, message.inboxMessage)
      case 'DELETE_INBOX':
        return deleteInboxMessage(conn, message.newMessageList)
      case 'PACIFISM':
        return togglePacifism(conn, message.pacifist, message.disabledDays)
      case 'TRAIN_TROOPS':
        return trainTroops(conn, message.troopType, message.amountToTrain)
      case 'SEND_TROOPS':
        return sendTroops(conn, message.sender, message.target, message.troopsToSend, message.travelTime)
      default:
        console.error('Client sent a message of unknown type.') // tslint:disable-line:no-console
        break
    }
  }

  public addConnection(conn: Connection) {
    this.connections.push(conn)
    conn.onMessage((_, message) => this.handleMessage(conn, message))
    conn.onClose(() => this.removeConnection(conn))
  }

  public removeConnection(conn: Connection) {
    const index = this.connections.findIndex(c => c.id === conn.id)
    this.connections.splice(index, 1)
  }

  public async createAccount(conn: Connection, username: string, password: string) {
    if (await createNewAccount(conn, username, password)) {
      this.loginAccount(conn, username, password)
      getUserData(conn)
    }
  }

  public async loginAccount(conn: Connection, username: string, password: string) {
    const token = await login(conn, username, password)
    if (token) {
      conn.sendMessage({type: 'TOKEN', token, username})
      getUserData(conn)
    } else {
      conn.sendMessage({type: 'ERROR', message: 'Wrong username or password'})
    }
  }

  public verifyToken(token: string) {
    if (token) {
      const decodedToken = jwt.verify(token.substr(7), process.env.SECRET || 'DEVELOPMENT')
      if (typeof decodedToken === 'string') {
        return decodedToken
      }
    }
    return null
  }
}

export default CivicoServer
