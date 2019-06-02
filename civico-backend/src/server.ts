import jwt from 'jsonwebtoken'
import Connection from './connection'
import {Message} from './types/protocol'
import {createNewAccount, login, logout, getUserData} from './firebase/users'
import {levelUpField} from './firebase/fields'

class CivicoServer {
  private connections: Connection[] = []

  public handleMessage(conn: Connection, message: Message) {
    let id: string | null = null
    switch (message.type) {
      case 'CREATE_ACCOUNT':
        return this.createAccount(conn, message.username, message.password)
      case 'LOGIN':
        return this.loginAccount(conn, message.username, message.password)
      case 'LOGOUT':
        id = this.verifyToken(message.token)
        if (id) {
          return logout(conn)
        }
        return conn.sendMessage({type: 'TOKEN', token: '', username: ''})
      case 'GET_DATA':
        id = this.verifyToken(message.token)
        if (id) {
          return getUserData(conn)
        }
        return conn.sendMessage({type: 'TOKEN', token: '', username: ''})
      case 'FIELD_LEVELUP':
        id = this.verifyToken(message.token)
        if (id) {
          return levelUpField(conn, message.row, message.column, message.newLevel)
        }
        return conn.sendMessage({type: 'TOKEN', token: '', username: ''})
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
