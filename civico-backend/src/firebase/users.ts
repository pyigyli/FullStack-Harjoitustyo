import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './init'
import {UserData, GridSlot, DispatchedTroops} from '../types/protocol'
import Connection from '../connection'
import {resultBattle} from './military'

export const createNewAccount = async (conn: Connection, username: string, password: string) => {
  try {
    const findDuplicateUser = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    if (findDuplicateUser.toJSON()) {
      conn.sendMessage({type: 'ERROR', message: 'Username already taken.'})
      return false
    }
    const passwordHash = await bcrypt.hash(password, 10)
    let x: number = Math.floor(Math.random() * 500)
    let y: number = Math.floor(Math.random() * 500)
    let mapSlotSnapshot = await db.ref(`map/${x}/${y}`).once('value')
    let mapSlot = mapSlotSnapshot.toJSON()
    while (mapSlot !== null) {
      x = Math.floor(Math.random() * 500)
      y = Math.floor(Math.random() * 500)
      mapSlotSnapshot = await db.ref(`map/${x}/${y}`).once('value')
      mapSlot = mapSlotSnapshot.toJSON()
    }
    await db.ref(`map/${x}/${y}`).set(username)
    const ref = db.ref(`users`).push({
      username,
      passwordHash,
      population: 1,
      lumber: 450,
      iron: 450,
      clay: 450,
      wheat: 450,
      maxLumber: 500,
      maxIron: 500,
      maxClay: 500,
      maxWheat: 500,
      lumberRate: 10,
      ironRate: 10,
      clayRate: 10,
      wheatRate: 10,
      fields: [
        [{name: '?CAVE',   level: 0}, {name: '?WHEAT', level: 0}, {name: '?CLAY',   level: 0}, {name: '?CAVE', level: 0}, {name: '?WHEAT',  level: 0}],
        [{name: '?WHEAT',  level: 0}, {name: '?CLAY',  level: 0}, {name: 'FOREST',  level: 0}, {name: '?CAVE', level: 0}, {name: '?WHEAT',  level: 0}],
        [{name: '?FOREST', level: 0}, {name: 'CLAY',   level: 0}, {name: 'TOWN',    level: 0}, {name: 'CAVE',  level: 0}, {name: '?CLAY',   level: 0}],
        [{name: '?CLAY',   level: 0}, {name: '?WHEAT', level: 0}, {name: 'WHEAT',   level: 0}, {name: '?CAVE', level: 0}, {name: '?FOREST', level: 0}],
        [{name: '?FOREST', level: 0}, {name: '?CAVE',  level: 0}, {name: '?FOREST', level: 0}, {name: '?CLAY', level: 0}, {name: '?FOREST', level: 0}]
      ],
      buildings: [
        [{name: 'EMPTY', level: 0}, {name: 'EMPTY', level: 0}, {name: 'EMPTY', level: 0}],
        [{name: 'EMPTY', level: 0}, {name: 'EMPTY', level: 0}, {name: 'EMPTY', level: 0}],
        [{name: 'EMPTY', level: 0}, {name: 'EMPTY', level: 0}, {name: 'EMPTY', level: 0}]
      ],
      mapCoordinates: {x, y},
      troops: {'Knife Boy': 0, Spearman: 0, Swordsman: 0, 'Donkey Rider': 0, Jouster: 0, 'Dark Knight': 0},
      timestamp: Date.now(),
      pacifist: true,
      pacifismDisabledUntil: 0
    })
    const user = await ref.once('value')
    conn.id = user.key || ''
    return true
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const deleteAccount = async (conn: Connection) => {
  try {
    const mapCoordinatesSnapshot = await db.ref(`users/${conn.id}/mapCoordinates`).once('value')
    const mapCoordinates = mapCoordinatesSnapshot.toJSON() as any
    await db.ref(`users/${conn.id}`).remove()
    await db.ref(`map/${mapCoordinates.x}/${mapCoordinates.y}`).remove()
    conn.id = ''
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const login = async (conn: Connection, username: string, password: string) => {
  try {
    const userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    const user = userSnapshot.toJSON()
    if (user && await bcrypt.compare(password, Object.values(user)[0].passwordHash)) {
      const id = Object.keys(user)[0]
      const token = `Bearer ${jwt.sign(id, process.env.SECRET || 'DEVELOPMENT')}`
      await db.ref(`users/${id}/token`).set(token)
      conn.id = id
      return token
    }
    return null
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const logout = async (conn: Connection) => {
  try {
    await db.ref(`users/${conn.id}/token`).remove()
    conn.id = ''
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const getUserData = async (conn: Connection) => {
  try {
    let userSnapshot: firebase.database.DataSnapshot = await db.ref(`users/${conn.id}`).once('value')
    let user: UserData = userSnapshot.toJSON() as UserData
    if (user) {
      const fields: GridSlot[][] = []
      Object.values(user.fields).forEach((row: any[]) => {
        const rowToPush: GridSlot[] = []
        Object.values(row).forEach((slot: GridSlot) => rowToPush.push(slot))
        fields.push(rowToPush)
      })
      const buildings: GridSlot[][] = []
      Object.values(user.buildings).forEach((row: any[]) => {
        const rowToPush: GridSlot[] = []
        Object.values(row).forEach((slot: GridSlot) => rowToPush.push(slot))
        buildings.push(rowToPush)
      })
      const troops = {...user.troops}
      let troopsOnMove: DispatchedTroops[] = user.troopsOnMove ? Object.values(user.troopsOnMove) : []
      const currentTime = Date.now()
      if (user.troopsOnMove) {
        for (const group in user.troopsOnMove) {
          if (user.troopsOnMove[group].arrivalTime - currentTime <= 0 && !user.troopsOnMove[group].headingBack) {
            await resultBattle(conn, user.troopsOnMove[group])
          }
        }
        userSnapshot = await db.ref(`users/${conn.id}`).once('value')
        user = userSnapshot.toJSON() as UserData
        troopsOnMove = user.troopsOnMove ? Object.values(user.troopsOnMove) : []
        if (troopsOnMove.length > 0) {
          let stoleEachResourceTotal: number = 0
          for (const group in troopsOnMove) {
            if (troopsOnMove[group].arrivalTime - currentTime <= 0 && troopsOnMove[group].headingBack) {
              for (const troopType of Object.keys(troopsOnMove[group].troops)) {
                troops[troopType] += troopsOnMove[group].troops[troopType]
              }
              stoleEachResourceTotal += troopsOnMove[group].stoleEachResource
              delete troopsOnMove[group]
            }
          }
          if (!conn.id) {
            return
          }
          const timePassed = currentTime - user.timestamp
          await db.ref(`users/${conn.id}`).update({
            lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate , user.maxLumber) + stoleEachResourceTotal,
            iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron) + stoleEachResourceTotal,
            clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay) + stoleEachResourceTotal,
            wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat) + stoleEachResourceTotal,
            troops,
            troopsOnMove,
            timestamp: currentTime
          })
        }
      }
      const timePassed = currentTime - user.timestamp
      conn.sendMessage({
        type: 'SEND_DATA',
        ...user,
        lumber: Math.min(user.lumber + timePassed / 3600000 * user.lumberRate , user.maxLumber),
        iron:   Math.min(user.iron   + timePassed / 3600000 * user.ironRate, user.maxIron),
        clay:   Math.min(user.clay   + timePassed / 3600000 * user.clayRate, user.maxClay),
        wheat:  Math.min(user.wheat  + timePassed / 3600000 * (user.wheatRate - user.population), user.maxWheat),
        fields,
        buildings,
        mapCoordinates: Object.values(user.mapCoordinates),
        inbox: user.inbox ? Object.values(user.inbox) : [],
        troops,
        troopsOnMove: Object.values(troopsOnMove) as DispatchedTroops[]
      })
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const getUserProfile = async (conn: Connection, username: string) => {
  try {
    const userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    const user: UserData = Object.values(userSnapshot.toJSON() as UserData)[0]
    if (user) {
      const userProfile = {
        username,
        population: user.population,
        bio: user.bio || []
      }
      conn.sendMessage({type: 'SEND_PROFILE', userProfile})
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const changeBio = async (conn: Connection, newBio: string[]) => {
  try {
    const userSnapshot = await db.ref(`users/${conn.id}`).once('value')
    const user = userSnapshot.toJSON() as UserData
    if (user) {
      await db.ref(`users/${conn.id}`).update({bio: newBio})
      const userProfile = {
        username: user.username,
        population: user.population,
        bio: newBio
      }
      conn.sendMessage({type: 'SEND_PROFILE', userProfile})
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
