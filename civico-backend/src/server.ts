import jwt from 'jsonwebtoken'
import Connection from './connection'
import {Message} from './types/protocol'
import {createNewAccount, login, logout} from './firebase/users'

class CivicoServer {
  private connections: Connection[] = []

  public handleMessage(conn: Connection, message: Message) {
    switch (message.type) {
      case 'CREATE_ACCOUNT':
        return this.createAccount(conn, message.username, message.password)
      case 'LOGIN':
        return this.loginAccount(conn, message.username, message.password)
      case 'LOGOUT':
        const id = this.verifyToken(message.token)
        if (id) {
          return logout(conn, id)
        }
        conn.sendMessage({type: 'TOKEN', token: ''})
        conn.sendMessage({type: 'ERROR', message: 'Account verification failed. Please log in again.'})
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
