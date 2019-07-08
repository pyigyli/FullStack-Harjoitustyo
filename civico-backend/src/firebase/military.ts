import db from './init'
import {UserData, troopsData, Troops, DispatchedTroops} from "../types/protocol"
import Connection from "../connection"
import {getUserData} from "./users"

export const togglePacifism = async (conn: Connection, pacifist: boolean, disabledDays: number) => {
  try {
    await db.ref(`users/${conn.id}`).update({
      pacifist,
      pacifismDisabledUntil: Date.now() + disabledDays * 86400000
    })
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const trainTroops = async (conn: Connection, troopType: string, amountToTrain: number) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user = userSnapshot.toJSON() as UserData
    const currentTime = Date.now()
    const timePassed = currentTime - user.timestamp
    await db.ref(`users/${conn.id}`).update({
      lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber) - troopsData[troopType].lumberCost,
      iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron) - troopsData[troopType].ironCost,
      clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay) - troopsData[troopType].clayCost,
      wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) - troopsData[troopType].wheatCost,
      timestamp: currentTime
    })
    await db.ref(`users/${conn.id}/troops`).update({[troopType]: user.troops[troopType] + amountToTrain})
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const sendTroops = async (conn: Connection, target: string | boolean, troopsToSend: Troops, travelTime: number) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user = userSnapshot.toJSON() as UserData
    let troopsLeftInTown: Troops = user.troops
    for (const troopType in troopsLeftInTown) {
      troopsLeftInTown[troopType] -= troopsToSend[troopType]
    }
    const currentTime = Date.now()
    const timePassed = currentTime - user.timestamp
    const troopsOnMove = user.troopsOnMove ? Object.values(user.troopsOnMove) : []
    troopsOnMove.push({
      headingBack: false,
      target,
      troops: troopsToSend,
      travelTime,
      arrivalTime: currentTime + travelTime
    })
    await db.ref(`users/${conn.id}`).update({
      lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber),
      iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron),
      clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay),
      wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat),
      troops: troopsLeftInTown,
      troopsOnMove: troopsOnMove,
      timestamp: currentTime
    })
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const resultBattle = async (conn: Connection, troopsOnMove: DispatchedTroops) => {
  try {
    let defencePower: number = Math.round(Math.random() * 100) + 100
    if (troopsOnMove.target) {
      const targetUserSnapshot = await db.ref('users').orderByChild('username').equalTo(troopsOnMove.target).once('value')
      const targetUser = targetUserSnapshot.toJSON() as UserData
      const targetTroops = targetUser.troops
      defencePower = Object.entries(targetTroops).reduce((value: number, entry) => value + troopsData[entry[0]].attack * entry[1], 0)
    }
    const attackPower = Object.entries(troopsOnMove.troops).reduce((value: number, entry) => value + troopsData[entry[0]].attack * entry[1], 0)
    const emptyTroops = troopsOnMove.troops
    for (const troopType in emptyTroops) {
      emptyTroops[troopType] = 0
    }
    if (attackPower > defencePower) {
      return {
        headingBack: true,
        target: troopsOnMove.target || false,
        troops: emptyTroops,
        travelTime: troopsOnMove.travelTime,
        arrivalTime: Date.now() + troopsOnMove.travelTime
      }
    }
    return 'LOST'
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
  return null
}
