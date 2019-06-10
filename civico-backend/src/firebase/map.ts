import db from './init'
import Connection from '../connection'
import {MapSlot} from '../types/protocol'

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
    Object.entries(slots).forEach((entry: any[]) => {
      map[entry[0]][Object.keys(entry[1])[0]] = Object.values(entry[1])[0] as string
    })
    conn.sendMessage({type: 'SEND_MAP', map})
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const getUserCoordinates = async (conn: Connection, username: string) => {
  try {
    const coordinatesSnapshot = await db.ref('map').orderByChild('username').equalTo(username).once('value')
    const coordinates = coordinatesSnapshot.toJSON() as MapSlot
    console.log(coordinates)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}