import db from './init'
import Connection from '../connection'
import {UserData, GridSlot, townExpansionData, buildingsData} from '../types/protocol'
import {getUserData} from './users'

export const levelUpBuilding = async (conn: Connection) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userReference.toJSON() as UserData
    if (user) {
      // TODO
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const placeBuilding = async (conn: Connection, buildings: GridSlot[][], newBuildingName: string) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userReference.toJSON() as UserData
    if (user) {
      const building = buildingsData[newBuildingName]
      const currentTime = new Date().getTime()
      const timePassed = currentTime - user.timestamp
      await db.ref(`users/${conn.id}`).update({
        lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber) - building.lumberCost,
        iron: Math.min(user.iron + timePassed / 3600000 * user.ironRate, user.maxIron) - building.ironCost,
        clay: Math.min(user.clay + timePassed / 3600000 * user.clayRate, user.maxClay) - building.clayCost,
        wheat: Math.min(user.wheat + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) - building.wheatCost,
        buildings: buildings,
        timestamp: currentTime
      })
      getUserData(conn)
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const expandTown = async (conn: Connection) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userReference.toJSON() as UserData
    if (user) {
      const newGrid: GridSlot[][] = []
      const emptyRow: GridSlot[] = []
      for (let i = 0; i < Object.values(user.buildings).length + 2; i++) {
        emptyRow.push({name: 'EMPTY', level: 0})
      }
      newGrid.push(emptyRow)
      for (let i = 0; i < Object.values(user.buildings).length; i++) {
        const middleRow: GridSlot[] = []
        middleRow.push({name: 'EMPTY', level: 0})
        for (let j = 0; j < Object.values(user.buildings).length; j++) {
          middleRow.push(user.buildings[i][j])
        }
        middleRow.push({name: 'EMPTY', level: 0})
        newGrid.push(middleRow)
      }
      newGrid.push(emptyRow)
      const expansion = user.buildings.length === 3 ? townExpansionData.first : townExpansionData.second
      const currentTime = new Date().getTime()
      const timePassed = currentTime - user.timestamp
      await db.ref(`users/${conn.id}`).update({
        lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber) - expansion.lumberCost,
        iron: Math.min(user.iron + timePassed / 3600000 * user.ironRate, user.maxIron) - expansion.ironCost,
        clay: Math.min(user.clay + timePassed / 3600000 * user.clayRate, user.maxClay) - expansion.clayCost,
        wheat: Math.min(user.wheat + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) - expansion.wheatCost,
        buildings: newGrid,
        timestamp: currentTime
      })
      getUserData(conn)
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
