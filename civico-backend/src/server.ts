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
        break
      default:
        throw new Error('Client send a message of unknown type.')
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
    await createNewAccount(conn, username, password)
    this.loginAccount(conn, username, password)
  }

  public async loginAccount(conn: Connection, username: string, password: string) {
    const token = await login(conn, username, password)
    if (token) {
      conn.sendMessage({type: 'AUTHORIZE', token})
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
