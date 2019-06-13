import db from './init'
import Connection from '../connection'
import {UserData, InboxMessage} from '../types/protocol'

export const sendInboxMessage = async (conn: Connection, inboxMessage: InboxMessage) => {
  try {
    const receiverSnapshot = await db.ref('users').orderByChild('username').equalTo(inboxMessage.receiver).once('value')
    const receiver = receiverSnapshot.toJSON() as UserData
    const inbox = Object.values(receiver)[0].inbox
    // await db.ref(`users/${inboxMessage.receiver}`) TODO
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}