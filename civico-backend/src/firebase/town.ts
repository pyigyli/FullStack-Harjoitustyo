import db from './init'
import Connection from '../connection'

export const levelUpTown = async (conn: Connection) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const userJSON = userSnapshot.toJSON()
    if (userJSON) {
      // TODO
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
