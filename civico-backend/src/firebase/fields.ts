import db from './init'
import Connection from '../connection'
import {UserData, FieldSlot, fieldSlotData} from '../types/protocol'
import {getUserData} from './users'

export const levelUpField = async (conn: Connection, row: number, column: number, newLevel: number) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userReference.toJSON() as UserData
    const slot: FieldSlot = fieldSlotData[user.fields[row][column].name][newLevel]
    const currentTime = new Date().getTime()
    const timePassed = currentTime - user.timestamp
    await db.ref(`users/${conn.id}`).update({
      population: user.population + slot.populationGain,
      lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber) - slot.lumberCost,
      iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron) - slot.ironCost,
      clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay) - slot.clayCost,
      wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) - slot.wheatCost,
      lumberRate: user.lumberRate + slot.lumberRateGain,
      ironRate:   user.ironRate   + slot.ironRateGain,
      clayRate:   user.clayRate   + slot.clayRateGain,
      wheatRate:  user.wheatRate  + slot.wheatRateGain,
      timestamp: currentTime
    })
    await db.ref(`users/${conn.id}/fields/${row}/${column}/level`).set(newLevel)
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
