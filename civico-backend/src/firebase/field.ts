import db from './init'
import Connection from '../connection'

export const getFieldById = async (conn: Connection) => {
  try {
    const fieldSnapshot = await db.ref(`fields/${conn.id}`).once('value')
    const fieldJSON = fieldSnapshot.toJSON()
    if (fieldJSON) {
      const fieldGrid: string[][] = []
      Object.values(fieldJSON).forEach(row => {
        const fieldGridRow: string[] = []
        Object.values(row).forEach((slot: string) => {
          fieldGridRow.push(slot)
        })
        fieldGrid.push(fieldGridRow)
      })
      conn.sendMessage({type: 'SEND_FIELD', fieldGrid})
    } else {
      conn.sendMessage({type: 'SEND_FIELD', fieldGrid: [
        ['?CAVE', '?ELECTRICITY', '?CLAY', '?CAVE', '?WHEAT'],
        ['?WHEAT', '?WHEAT', 'FOREST', '?CAVE', '?WHEAT'],
        ['?FOREST', 'CLAY', 'TOWN', 'CAVE', '?CLAY'],
        ['?LAIR', '?WHEAT', 'WHEAT', '?LAKE', '?AIRPORT'],
        ['?FOREST', '?CAVE', '?FOREST', '?CLAY', '?FOREST']
      ]})
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}