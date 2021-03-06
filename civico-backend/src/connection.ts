import * as WebSocket from 'ws'
import {Message} from './types/protocol'

type MessageHandler = (conn: Connection, msg: Message) => void
type CloseHandler = () => void

class Connection {
  public id: string
  public token: string
  private socket: WebSocket
  private messageHandlers: MessageHandler[] = []
  private closeHandlers: CloseHandler[] = []

  constructor(socket: WebSocket) {
    this.id = ''
    this.token = ''
    this.socket = socket

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
    console.error(error) // tslint:disable-line:no-console
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
