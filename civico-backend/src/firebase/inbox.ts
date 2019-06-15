import db from './init'
import Connection from '../connection'
import {UserData, InboxMessage} from '../types/protocol'
import {getUserData} from './users'

export const setInboxMessagesToRead = async (conn: Connection, inboxIndexes: number[]) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userSnapshot.toJSON() as UserData
    const inbox = Object.values(user.inbox)
    inboxIndexes.forEach((index: number) => inbox[index].unread = false)
    await db.ref(`users/${conn.id}`).update({inbox})
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const sendInboxMessage = async (conn: Connection, inboxMessage: InboxMessage) => {
  try {
    const receiverSnapshot = await db.ref('users').orderByChild('username').equalTo(inboxMessage.receiver).once('value')
    const receiver = receiverSnapshot.toJSON() as UserData
    if (!receiver) {
      return conn.sendMessage({type: 'CONFIRM_INBOX', successful: false})
    }
    const inbox: InboxMessage[] = Object.values(receiver)[0].inbox || []
    await db.ref(`users/${Object.keys(receiver)[0]}`).update({inbox: [...Object.values(inbox), inboxMessage]})
    return conn.sendMessage({type: 'CONFIRM_INBOX', successful: true})
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
