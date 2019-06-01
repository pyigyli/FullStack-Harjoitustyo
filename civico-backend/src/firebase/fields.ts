import db from './init'
import Connection from '../connection'
import {getUserData} from './users'

interface UserData {
  population: number
  lumber: number
  iron: number
  clay: number
  wheat: number
  maxLumber: number
  maxIron: number
  maxClay: number
  maxWheat: number
  lumberRate: number
  ironRate: number
  clayRate: number
  wheatRate: number
  fields: Array<Array<{
    name: string
    level: number
  }>>
  buildings: Array<Array<{
    name: string
    level: number
  }>>
  map: number[]
  inbox: Array<{
    sender: string
    title: string
    message: string
  }>
  timestamp: number
}

interface FieldSlot {
  level: number,
  cost: {
    lumber: number,
    iron: number,
    clay: number,
    wheat: number
  }
}

export const levelUpField = async (conn: Connection, row: number, column: number, newLevel: number) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user = userReference.toJSON() as UserData
    const slotReference = await db.ref(`fields/${user.fields[row][column].name}`).once('value')
    const slot = slotReference.toJSON() as FieldSlot
    const timePassed = new Date().getTime() - user.timestamp
    await db.ref(`users/${conn.id}`).update({
      population: user.population + slot.cost[newLevel].population,
      lumber: Math.min(user.lumber + timePassed / user.lumberRate, user.maxLumber) - slot.cost[newLevel].lumber,
      iron: Math.min(user.iron + timePassed / user.ironRate, user.maxIron) - slot.cost[newLevel].iron,
      clay: Math.min(user.clay + timePassed / user.clayRate, user.maxClay) - slot.cost[newLevel].clay,
      wheat: Math.min(user.wheat + timePassed / user.wheatRate, user.maxWheat) - slot.cost[newLevel].wheat,
      timestamp: new Date().getTime()
    })
    await db.ref(`users/${conn.id}/fields/${row}/${column}/level`).set(newLevel)
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
