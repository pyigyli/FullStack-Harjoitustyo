import * as WebSocket from 'ws'
import uuid from 'uuid'
import {Message} from './types/protocol'

type MessageHandler = (conn: Connection, msg: Message) => void;
type CloseHandler = () => void;

class Connection {
	public id = uuid.v4()
	public closed = false

	private socket: WebSocket
	private messageHandlers: MessageHandler[] = []
	private closeHandlers: CloseHandler[] = []

	constructor(socket: WebSocket) {
		this.socket = socket;

		socket.on('message', data => {
			const message: Message = JSON.parse(data.toString())
			for (const handler of this.messageHandlers) {
				try {
					handler(this, message)
				} catch (err) {
					this.handleError(err)
				}
			}
		})

		socket.on('close', () => {
			this.closed = true
			for (const handler of this.closeHandlers) {
				try {
					handler()
				} catch (err) {
					this.handleError(err)
				}
			}
		})
	}

	public handleError(error: Message) {
		console.error(error); // tslint:disable-line:no-console
	}

	public sendMessage(message: Message): void {
		try {
			this.socket.send(JSON.stringify(message))
		} catch (err) {
			console.error(err) // tslint:disable-line:no-console
		}
	}

	public onMessage(handler: MessageHandler): void {
		this.messageHandlers.push(handler)
	}

	public onClose(handler: CloseHandler): void {
		this.closeHandlers.push(handler)
	}
}

export default Connection