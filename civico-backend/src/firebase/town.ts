import db from './init'
import Connection from '../connection'

export const getTownById = async (conn: Connection) => {
  try {
    const townSnapshot = await db.ref(`towns/${conn.id}`).once('value')
    const townJSON = townSnapshot.toJSON()
    if (townJSON) {
      const townGrid: string[][] = []
      Object.values(townJSON).forEach(row => {
        const townGridRow: string[] = []
        Object.values(row).forEach((slot: string) => {
          townGridRow.push(slot)
        })
        townGrid.push(townGridRow)
      })
      conn.sendMessage({type: 'SEND_TOWN', townGrid})
    } else {
      conn.sendMessage({type: 'SEND_TOWN', townGrid: [
        ['EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY'],
        ['EMPTY', 'EMPTY', 'EMPTY']
      ]})
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err)
  }
}