import db from './init'
import {UserData, troopsData, Troops, DispatchedTroops} from '../types/protocol'
import Connection from '../connection'
import {getUserData} from './users'

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

export const sendTroops = async (conn: Connection, sender: string, target: string | false, troopsToSend: Troops, travelTime: number) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user = userSnapshot.toJSON() as UserData
    const troopsLeftInTown: Troops = user.troops
    for (const troopType of Object.keys(troopsLeftInTown)) {
      troopsLeftInTown[troopType] -= troopsToSend[troopType]
    }
    const currentTime = Date.now()
    const timePassed = currentTime - user.timestamp
    const troopsOnMove = user.troopsOnMove ? Object.values(user.troopsOnMove) : []
    troopsOnMove.push({
      sender,
      target,
      troops: troopsToSend,
      resources: {lumber: 0, iron: 0, clay: 0, wheat: 0},
      headingBack: false,
      travelTime,
      arrivalTime: currentTime + travelTime
    })
    await db.ref(`users/${conn.id}`).update({
      lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber),
      iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron),
      clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay),
      wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat),
      troops: troopsLeftInTown,
      troopsOnMove,
      timestamp: currentTime
    })
    getUserData(conn)
    if (target) {
      const targetUserSnapshot = await db.ref('users').orderByChild('username').equalTo(target).once('value')
      const targetEntry = Object.entries(targetUserSnapshot.toJSON() as Object)[0]
      await db.ref(`users/${targetEntry[0]}`).update({
        troopsOnMove: [
          ...targetEntry[1].troopsOnMove ? Object.values(targetEntry[1].troopsOnMove) : [],
          {
            sender,
            target,
            troops: troopsToSend,
            headingBack: false,
            travelTime,
            arrivalTime: currentTime + travelTime
          }
        ]
      })
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const resultBattle = async (conn: Connection, troopsOnMove: DispatchedTroops) => {
  try {
    const attackingTroops = {...troopsOnMove.troops}
    let defendingTroops: Troops = {...troopsOnMove.troops}
    let targetUserSnapshot: firebase.database.DataSnapshot | undefined
    let targetUser: UserData
    if (troopsOnMove.target) {
      targetUserSnapshot = await db.ref('users').orderByChild('username').equalTo(troopsOnMove.target).once('value')
      targetUser = Object.values(targetUserSnapshot.toJSON() as Object)[0]
      defendingTroops = {...targetUser.troops}
    } else {
      let index: number = 0
      for (const troopType of Object.keys(troopsOnMove.troops)) {
        const randomTroopTypeAmount = 10 - index * 2 + Math.floor(Math.random() * 50) - index * 5
        defendingTroops[troopType] = randomTroopTypeAmount > 0 ? randomTroopTypeAmount : 0
        index++
      }
    }
    const survivingAttackers = {...troopsOnMove.troops}
    const survivingDefenders = {...troopsOnMove.troops}
    for (const troopType of Object.keys(troopsOnMove.troops)) {
      survivingAttackers[troopType] = 0
      survivingDefenders[troopType] = 0
    }
    let filteredAttackers: Array<[string, number]> = Object.entries(attackingTroops).filter(entry => entry[1] > 0)
    let filteredDefenders: Array<[string, number]> = Object.entries(defendingTroops).filter(entry => entry[1] > 0)
    const attackPower  = filteredAttackers.reduce((value: number, entry) => value + troopsData[entry[0]].attack  * entry[1], 0)
    const defencePower = filteredDefenders.reduce((value: number, entry) => value + troopsData[entry[0]].defence * entry[1], 0)
    while (filteredAttackers.length > 0 && filteredDefenders.length > 0) {
      const randomAttackSoldier = Math.ceil(Math.random() * (filteredAttackers.length - 1))
      const randomDefendSoldier = Math.ceil(Math.random() * (filteredDefenders.length - 1))
      attackingTroops[filteredAttackers[randomAttackSoldier][0]]--
      defendingTroops[filteredDefenders[randomDefendSoldier][0]]--
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
    for (const troopType of Object.keys(troopsOnMove.troops)) {
      survivingAttackers[troopType] += attackingTroops[troopType]
      survivingDefenders[troopType] += defendingTroops[troopType]
    }
    const userSnapshot = await db.ref('users').orderByChild('username').equalTo(troopsOnMove.sender).once('value')
    const userEntry = Object.entries(userSnapshot.toJSON() as Object)[0]
    const newUserTroopsOnMove = userEntry[1].troopsOnMove ? Object.values(userEntry[1].troopsOnMove).filter((group: DispatchedTroops) =>
      group.sender !== troopsOnMove.sender ||
      group.target !== troopsOnMove.target ||
      group.headingBack !== troopsOnMove.headingBack ||
      group.travelTime !== troopsOnMove.travelTime ||
      group.arrivalTime !== troopsOnMove.arrivalTime
    ) : []
    const stolenResources = {lumber: 0, iron: 0, clay: 0, wheat: 0}
    if (Object.values(survivingAttackers).filter((soldierAmount: number) => soldierAmount > 0).length > 0) {
      if (troopsOnMove.target && targetUserSnapshot) {
        const targetEntry = Object.entries(targetUserSnapshot.toJSON() as Object)[0]
        const currentTime = Date.now()
        const timePassed = currentTime - targetEntry[1].timestamp
        const singleResourceStealAmount = Math.min(
          Math.min(targetEntry[1].lumber + timePassed / 3600000 * targetEntry[1].lumberRate , targetEntry[1].maxLumber),
          Math.min(targetEntry[1].iron   + timePassed / 3600000 * targetEntry[1].ironRate, targetEntry[1].maxIron),
          Math.min(targetEntry[1].clay   + timePassed / 3600000 * targetEntry[1].clayRate, targetEntry[1].maxClay),
          Math.min(targetEntry[1].wheat  + timePassed / 3600000 * (targetEntry[1].wheatRate - targetEntry[1].population), targetEntry[1].maxWheat),
          Object.entries(troopsOnMove.troops).reduce((capasity: number, troopTypeEntry: [string, number]) => {
            return capasity + troopTypeEntry[1] * troopsData[troopTypeEntry[0]].capasity
          }, 0)
        )
        for (const troopType of Object.keys(troopsOnMove.troops)) {
          stolenResources[troopType] = singleResourceStealAmount
        }
      }
      await db.ref(`users/${userEntry[0]}`).update({
        troopsOnMove: [...newUserTroopsOnMove, {
          sender: troopsOnMove.sender,
          target: troopsOnMove.target,
          troops: survivingAttackers,
          resources: stolenResources,
          headingBack: true,
          travelTime: troopsOnMove.travelTime,
          arrivalTime: troopsOnMove.arrivalTime + troopsOnMove.travelTime
        }],
        inbox: [
          ...userEntry[1].inbox ? Object.values(userEntry[1].inbox) : [],
          {
            sender: '-',
            title: `Your troops fought against ${troopsOnMove.target || 'the forces of nature'}`,
            receiver: troopsOnMove.sender,
            message: troopsOnMove.target ? [
              `Attacking troops of ${troopsOnMove.sender}`,
              ...Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} attacked, ${entry[1]} survived.`),
              ' ',
              `Defending troops of ${troopsOnMove.target}`,
              ...Object.entries(survivingDefenders).map(entry => `${entry[0]}: ${targetUser.troops[entry[0]]} defended, ${entry[1]} survived.`)
            ] : Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} attacked, ${entry[1]} survived.`),
            date: troopsOnMove.arrivalTime,
            unread: true
          }
        ]
      })
    } else {
      await db.ref(`users/${userEntry[0]}`).update({
        troopsOnMove: newUserTroopsOnMove,
        inbox: [...userEntry[1].inbox ? Object.values(userEntry[1].inbox) : [], {
          sender: '-',
          title: `Your troops fought against ${troopsOnMove.target || 'the forces of nature'}`,
          receiver: troopsOnMove.sender,
          message: troopsOnMove.target ? [
            `Attacking troops of ${troopsOnMove.sender}`,
            ...Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} attacked, ${entry[1]} survived.`),
            ' ',
            `Defending troops of ${troopsOnMove.target}`,
            ...Object.entries(survivingDefenders).map(entry => `${entry[0]}: ${targetUser.troops[entry[0]]} defended, ${entry[1]} survived.`)
          ] : Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} attacked, ${entry[1]} survived.`),
          date: troopsOnMove.arrivalTime,
          unread: true
        }]
      })
    }
    if (troopsOnMove.target && targetUserSnapshot) {
      const targetEntry = Object.entries(targetUserSnapshot.toJSON() as Object)[0]
      const currentTime = Date.now()
      const timePassed = currentTime - targetEntry[1].timestamp
      await db.ref(`users/${targetEntry[0]}`).update({
        lumber: Math.min(targetEntry[1].lumber + timePassed / 3600000 * targetEntry[1].lumberRate , targetEntry[1].maxLumber) - stolenResources.lumber,
        iron:   Math.min(targetEntry[1].iron   + timePassed / 3600000 * targetEntry[1].ironRate, targetEntry[1].maxIron) - stolenResources.iron,
        clay:   Math.min(targetEntry[1].clay   + timePassed / 3600000 * targetEntry[1].clayRate, targetEntry[1].maxClay) - stolenResources.clay,
        wheat:  Math.min(targetEntry[1].wheat  + timePassed / 3600000 * (targetEntry[1].wheatRate - targetEntry[1].population), targetEntry[1].maxWheat) - stolenResources.wheat,
        troops: survivingDefenders,
        troopsOnMove: targetEntry[1].troopsOnMove ? Object.values(targetEntry[1].troopsOnMove).filter((group: DispatchedTroops) =>
          group.sender !== troopsOnMove.sender &&
          group.target !== troopsOnMove.target &&
          group.troops !== troopsOnMove.troops &&
          group.headingBack !== troopsOnMove.headingBack &&
          group.travelTime !== troopsOnMove.travelTime &&
          group.arrivalTime !== troopsOnMove.arrivalTime
        ) : [],
        inbox: [...targetEntry[1].inbox ? Object.values(targetEntry[1].inbox) : [], {
          sender: '-',
          title: `Your town was attacked by ${troopsOnMove.sender}`,
          receiver: troopsOnMove.target,
          message: [
            `Attacking troops of ${troopsOnMove.sender}:`,
            ...Object.entries(survivingAttackers).map(entry => `${entry[0]}: ${troopsOnMove.troops[entry[0]]} attacked, ${entry[1]} survived.`),
            ' ',
            `Defending troops of ${troopsOnMove.target}:`,
            ...Object.entries(survivingDefenders).map(entry => `${entry[0]}: ${targetEntry[1].troops[entry[0]]} defended, ${entry[1]} survived.`)
          ],
          date: troopsOnMove.arrivalTime,
          unread: true
        }],
        timestamp: currentTime
      })
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
