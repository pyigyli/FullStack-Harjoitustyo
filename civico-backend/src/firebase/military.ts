import db from './init'
import {UserData, troopsData, Troops, DispatchedTroops} from "../types/protocol"
import Connection from "../connection"
import {getUserData} from "./users"
import {sendInboxMessage} from './inbox'

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

export const sendTroops = async (conn: Connection, target: string | false, troopsToSend: Troops, travelTime: number) => {
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
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const resultBattle = async (conn: Connection, username: string, troopsOnMove: DispatchedTroops) => {
  try {
    const attackingTroops = {...troopsOnMove.troops}
    let defendingTroops: Troops = {...troopsOnMove.troops}
    let targetUserSnapshot: firebase.database.DataSnapshot
    let targetUser: UserData
    if (troopsOnMove.target) {
      targetUserSnapshot = await db.ref('users').orderByChild('username').equalTo(troopsOnMove.target).once('value')
      targetUser = Object.values(targetUserSnapshot.toJSON() as Object)[0]
      defendingTroops = {...targetUser.troops}
    } else {
      let index: number = 0
      for (const troopType in troopsOnMove.troops) {
        const randomTroopTypeAmount = 10 - index * 2 + Math.floor(Math.random() * 50) - index * 5
        defendingTroops[troopType] = randomTroopTypeAmount > 0 ? randomTroopTypeAmount : 0
        index++
      }
    }
    const survivingAttackers = {...troopsOnMove.troops}
    const survivingDefenders = {...troopsOnMove.troops}
    for (const troopType in troopsOnMove.troops) {
      survivingAttackers[troopType] = 0
      survivingDefenders[troopType] = 0
    }
    let filteredAttackers: [string, number][] = Object.entries(attackingTroops).filter(entry => entry[1] > 0)
    let filteredDefenders: [string, number][] = Object.entries(defendingTroops).filter(entry => entry[1] > 0)
    const attackPower  = filteredAttackers.reduce((value: number, entry) => value + troopsData[entry[0]].attack  * entry[1], 0)
    const defencePower = filteredDefenders.reduce((value: number, entry) => value + troopsData[entry[0]].defence * entry[1], 0)
    while (filteredAttackers.length > 0 && filteredDefenders.length > 0) {
      let randomAttackSoldier = Math.ceil(Math.random() * (filteredAttackers.length - 1))
      let randomDefendSoldier = Math.ceil(Math.random() * (filteredDefenders.length - 1))
      defendingTroops[filteredDefenders[randomDefendSoldier][0]]--
      attackingTroops[filteredAttackers[randomAttackSoldier][0]]--
      const soldiersAttack  = attackPower  / Math.random() * troopsData[filteredAttackers[randomAttackSoldier][0]].attack
      const soldiersDefence = defencePower / Math.random() * troopsData[filteredDefenders[randomDefendSoldier][0]].defence
      if (soldiersAttack > soldiersDefence) {
        survivingAttackers[filteredAttackers[randomAttackSoldier][0]]++
      } else if (soldiersAttack < soldiersDefence) {
        survivingDefenders[filteredDefenders[randomDefendSoldier][0]]++
      }
      filteredAttackers = Object.entries(attackingTroops).filter(entry => entry[1] > 0)
      filteredDefenders = Object.entries(defendingTroops).filter(entry => entry[1] > 0)
    }
    const date = Date.now()
    sendInboxMessage(conn, {
      sender: '-',
      title: `Your troops fought against ${troopsOnMove.target || 'the forces of nature'}`,
      receiver: username,
      message: troopsOnMove.target ? [
        ...Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} send, ${entry[1]} returned.`),
        ' ',
        ...Object.entries(survivingDefenders).map(entry => `${entry[0]}: ${targetUser.troops[entry[0]]} stood, ${entry[1]} fell.`)
      ] : Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} send, ${entry[1]} returned.`),
      date,
      unread: true
    })
    if (troopsOnMove.target) {
      sendInboxMessage(conn, {
        sender: '-',
        title: `Your town was attacked by ${username}`,
        receiver: troopsOnMove.target,
        message: [
          ...Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} send, ${entry[1]} returned.`),
          ' ',
          ...Object.entries(survivingDefenders).map(entry => `${entry[0]}: ${targetUser.troops[entry[0]]} stood, ${entry[1]} fell.`)
        ],
        date,
        unread: true
      })
    }
    if (Object.values(survivingAttackers).filter(soldierAmount => soldierAmount > 0).length > 0) {
      return {
        headingBack: true,
        target: troopsOnMove.target || false as false,
        troops: survivingAttackers,
        travelTime: troopsOnMove.travelTime,
        arrivalTime: troopsOnMove.arrivalTime + troopsOnMove.travelTime
      }
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
  return null
}
