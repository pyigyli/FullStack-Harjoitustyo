import Connection from './connection'
import {Message} from './types/protocol'

class CivicoServer {
	private connections: Connection[] = []

	public handleMessage(conn: Connection, message: Message) {
		// handle message
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
}

export default CivicoServer