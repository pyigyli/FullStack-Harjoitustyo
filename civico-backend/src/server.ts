import Connection from './connection'
import {Message} from './types/protocol'

class CivicoServer {
	private connections: Connection[] = []

	public handleMessage(conn: Connection, message: Message) {
		switch (message.type) {
			case 'CREATE_ACCOUNT':
				return this.createAccount(conn, message.username, message.password)
			case 'LOGIN':
				return this.login(conn, message.username, message.password)
			default:
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

	public createAccount(conn: Connection, username: String, password: String) {
		// TODO
	}

	public login(conn: Connection, username: String, password: String) {
		// TODO
	}
}

export default CivicoServer