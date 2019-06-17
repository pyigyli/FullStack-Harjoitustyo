import db from './init'
import Connection from '../connection'
import {UserData, GridSlot, BuildingSlot, townExpansionData, buildingsData} from '../types/protocol'
import {getUserData} from './users'

export const placeBuilding = async (conn: Connection, buildings: GridSlot[][], newBuildingName: string, moving: boolean) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userSnapshot.toJSON() as UserData
    const building = buildingsData[newBuildingName].level[1]
    const currentTime = new Date().getTime()
    const timePassed = currentTime - user.timestamp
    const currentLumber = Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber)
    const currentIron   = Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron)
    const currentClay   = Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay)
    const currentWheat  = Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat)
    await db.ref(`users/${conn.id}`).update({
      population: moving ? user.population : user.population + building.populationGain,
      lumber: currentLumber - (moving ? Math.floor(building.lumberCost / 5) : building.lumberCost),
      iron:   currentIron   - (moving ? Math.floor(building.ironCost   / 5) : building.ironCost),
      clay:   currentClay   - (moving ? Math.floor(building.clayCost   / 5) : building.clayCost),
      wheat:  currentWheat  - (moving ? Math.floor(building.wheatCost  / 5) : building.wheatCost),
      buildings,
      timestamp: currentTime
    })
    if (!moving) {
      await handlUniqueAttributesOfBuilding(conn, user, building)
    }
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const levelUpBuilding = async (conn: Connection, row: number, column: number, newLevel: number) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userSnapshot.toJSON() as UserData
    const slot: BuildingSlot = buildingsData[user.buildings[row][column].name].level[newLevel]
    const currentTime = new Date().getTime()
    const timePassed = currentTime - user.timestamp
    await db.ref(`users/${conn.id}`).update({
      population: user.population + slot.populationGain,
      lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate, user.maxLumber) - slot.lumberCost,
      iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron) - slot.ironCost,
      clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay) - slot.clayCost,
      wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) - slot.wheatCost,
      timestamp: currentTime
    })
    await db.ref(`users/${conn.id}/buildings/${row}/${column}/level`).set(newLevel)
    await handlUniqueAttributesOfBuilding(conn, user, slot)
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const deleteBuilding = async (conn: Connection, buildings: GridSlot[][], removedBuilding: GridSlot) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userSnapshot.toJSON() as UserData
    const building = buildingsData[removedBuilding.name]
    let buildingPopulationGain = 0
    for (let i = 1; i < removedBuilding.level; i++) {
      buildingPopulationGain += building.level[i].populationGain
    }
    await db.ref(`users/${conn.id}`).update({
      population: user.population - buildingPopulationGain,
      buildings
    })
    handlUniqueAttributesOfBuilding(conn, user, building.level[0])
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const expandTown = async (conn: Connection) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user: UserData = userSnapshot.toJSON() as UserData
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
      iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron) - expansion.ironCost,
      clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay) - expansion.clayCost,
      wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) - expansion.wheatCost,
      buildings: newGrid,
      timestamp: currentTime
    })
    getUserData(conn)
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

const handlUniqueAttributesOfBuilding = async (conn: Connection, user: UserData, newValues: any) => {
  try {
    await db.ref(`users/${conn.id}`).update({
      maxLumber: newValues.maxLumber ? newValues.maxLumber : user.maxLumber,
      maxIron:   newValues.maxIron   ? newValues.maxIron   : user.maxIron,
      maxClay:   newValues.maxClay   ? newValues.maxClay   : user.maxClay,
      maxWheat:  newValues.maxWheat  ? newValues.maxWheat  : user.maxWheat
    })
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
