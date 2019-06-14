import db from './init'
import Connection from '../connection'
import {UserData, InboxMessage} from '../types/protocol'
import {getUserData} from './users'

export const sendInboxMessage = async (conn: Connection, inboxMessage: InboxMessage) => {
  try {
    const receiverSnapshot = await db.ref('users').orderByChild('username').equalTo(inboxMessage.receiver).once('value')
    const receiver = receiverSnapshot.toJSON() as UserData
    let inbox: InboxMessage[] = Object.values(receiver)[0].inbox
    if (!inbox) {
      inbox = []
    }
    await db.ref(`users/${Object.keys(receiver)[0]}`).update({inbox: [...Object.values(inbox), inboxMessage]})
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const deleteInboxMessage = async (conn: Connection, newMessageList: InboxMessage[]) => {
  try {
    await db.ref(`users/${conn.id}`).update({inbox: newMessageList})
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
