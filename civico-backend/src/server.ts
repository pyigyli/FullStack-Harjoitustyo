import jwt from 'jsonwebtoken'
import Connection from './connection'
import {Message} from './types/protocol'
import {createNewAccount, login, logout} from './firebase/users'
import {getFieldById} from './firebase/field'
import {getTownById} from './firebase/town'

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
        return conn.sendMessage({type: 'TOKEN', token: ''})
      case 'GET_FIELD':
        id = this.verifyToken(message.token)
        if (id) {
          return getFieldById(conn)
        }
        return conn.sendMessage({type: 'TOKEN', token: ''})
      case 'GET_TOWN':
        id = this.verifyToken(message.token)
        if (id) {
          return getTownById(conn)
        }
        return conn.sendMessage({type: 'TOKEN', token: ''})
      case 'GET_MAP':
        // TODO
        break
      case 'GET_INBOX':
        // TODO
        break
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
    }
  }

  public async loginAccount(conn: Connection, username: string, password: string) {
    const token = await login(conn, username, password)
    if (token) {
      conn.sendMessage({type: 'TOKEN', token})
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
