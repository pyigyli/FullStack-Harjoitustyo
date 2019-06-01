import db from './init'
import Connection from '../connection'
import {UserData, FieldSlot} from '../types/protocol'
import {getUserData} from './users'

export const getFieldSlot = async (conn: Connection, row: number, column: number) => {
  try {
    // const userReference = await db.ref(`users/${conn.id}`).once('value')
    // const user = userReference.toJSON() as UserData
    // const slotReference = await db.ref(`fields/${user.fields[row][column].name}/${user.fields[row][column].level}`).once('value')
    // const slot = slotReference.toJSON() as FieldSlot
    // conn.sendMessage()
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const levelUpField = async (conn: Connection, row: number, column: number, newLevel: number) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user = userReference.toJSON() as UserData
    const slotReference = await db.ref(`fields/${user.fields[row][column].name}/${newLevel}`).once('value')
    const slot = slotReference.toJSON() as FieldSlot
    const currentTime = new Date().getTime()
    const timePassed = currentTime - user.timestamp
    await db.ref(`users/${conn.id}`).update({
      population: user.population + slot.populationGain,
      lumber: Math.min(user.lumber + timePassed / user.lumberRate, user.maxLumber) - slot.lumberCost,
      iron: Math.min(user.iron + timePassed / user.ironRate, user.maxIron) - slot.ironCost,
      clay: Math.min(user.clay + timePassed / user.clayRate, user.maxClay) - slot.clayCost,
      wheat: Math.min(user.wheat + timePassed / (user.wheatRate - user.population * 1000), user.maxWheat) - slot.wheatCost,
      lumberRate: user.lumberRate + slot.lumberRateGain,
      ironRate: user.ironRate + slot.ironRateGain,
      clayRate: user.clayRate + slot.clayRateGain,
      wheatRate: user.wheatRate + slot.wheatRateGain,
      buildTime: currentTime + slot.buildTime,
      timestamp: currentTime
    })
    await db.ref(`users/${conn.id}/fields/${row}/${column}/level`).set(newLevel)
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
