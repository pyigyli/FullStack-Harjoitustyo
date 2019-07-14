import db from './init'
import Connection from '../connection'

export const getMap = async (conn: Connection) => {
  try {
    const map: string[][] = []
    for (let i = 0; i < 500; i++) {
      const row: string[] = []
      for (let j = 0; j < 500; j++) {
        row.push('')
      }
      map.push(row)
    }
    const mapSnapshot = await db.ref('map').once('value')
    const slots = mapSnapshot.toJSON() as Object
    Object.entries(slots).forEach(entry => {
      map[entry[0]][Object.keys(entry[1])[0]] = Object.values(entry[1])[0]
    })
    conn.sendMessage({type: 'SEND_MAP', map})
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const getMapSlot = async (conn: Connection, username: string) => {
  try {
    const townDataSnapshot = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    const townData = Object.values(townDataSnapshot.toJSON() as Object)[0]
    conn.sendMessage({
      type: 'SEND_MAPSLOT',
      username,
      population: townData.population
    })
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
