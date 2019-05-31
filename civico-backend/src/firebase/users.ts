import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './init'
import Connection from '../connection'

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

interface GridSlot {
  name: string
  level: number
}

export const createNewAccount = async (conn: Connection, username: string, password: string) => {
  try {
    const findDuplicateUser = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    if (findDuplicateUser.toJSON()) {
      conn.sendMessage({type: 'ERROR', message: 'Username already taken.'})
      return false
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const ref = db.ref(`users`).push({
      username,
      passwordHash,
      population: 1,
      lumber: 100,
      iron: 100,
      clay: 100,
      wheat: 100,
      maxLumber: 500,
      maxIron: 500,
      maxClay: 500,
      maxWheat: 500,
      lumberRate: 720000, // milliseconds to gain 1 lumber
      ironRate: 720000,   // milliseconds to gain 1 iron
      clayRate: 720000,   // milliseconds to gain 1 clay
      wheatRate: 720000,  // milliseconds to gain 1 wheat
      fields: [
        [
          {name: '?CAVE', level: 0},
          {name: '?ELECTRICITY', level: 0},
          {name: '?CLAY', level: 0}, 
          {name: '?CAVE', level: 0},
          {name: '?WHEAT', level: 0}
        ], [
          {name: '?WHEAT', level: 0},
          {name: '?WHEAT', level: 0},
          {name: 'FOREST', level: 0},
          {name: '?CAVE', level: 0},
          {name: '?WHEAT', level: 0}
        ], [
          {name: '?FOREST', level: 0},
          {name: 'CLAY', level: 0},
          {name: 'TOWN', level: 0},
          {name: 'CAVE', level: 0},
          {name: '?CLAY', level: 0}
        ], [
          {name: '?LAIR', level: 0},
          {name: '?WHEAT', level: 0},
          {name: 'WHEAT', level: 0},
          {name: '?LAKE', level: 0},
          {name: '?AIRPORT', level: 0}
        ], [
          {name: '?FOREST', level: 0},
          {name: '?CAVE', level: 0},
          {name: '?FOREST', level: 0},
          {name: '?CLAY', level: 0},
          {name: '?FOREST', level: 0}
        ]
      ],
      buildings: [
        [
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0}
        ], [
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0}
        ], [
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0},
          {name: 'EMPTY', level: 0}
        ]
      ],
      map: [0, 0], // TODO
      inbox: [], // TODO welcoming message
      timestamp: new Date().getTime()
    })
    const user = await ref.once('value')
    conn.id = user.key || ''
    return true
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const login = async (conn: Connection, username: string, password: string) => {
  try {
    const user = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    const userJSON = user.toJSON()
    if (userJSON && await bcrypt.compare(password, Object.values(userJSON)[0].passwordHash)) {
      const id = Object.keys(userJSON)[0]
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

export const logout = (conn: Connection) => {
  try {
    db.ref(`users/${conn.id}/token`).remove()
    conn.id = ''
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}

export const getUserData = async (conn: Connection) => {
  try {
    const userReference = await db.ref(`users/${conn.id}`).once('value')
    const user = userReference.toJSON() as UserData || {}
    if (user) {
      const fields: GridSlot[][] = []
      Object.values(user.fields).forEach((row: Object[]) => {
        const rowToPush: GridSlot[] = []
        Object.values(row).forEach((slot: GridSlot) => {
          rowToPush.push(slot)
        })
        fields.push(rowToPush)
      })
      const buildings: GridSlot[][] = []
      Object.values(user.buildings).forEach((row: Object[]) => {
        const rowToPush: GridSlot[] = []
        Object.values(row).forEach((slot: GridSlot) => {
          rowToPush.push(slot)
        })
        buildings.push(rowToPush)
      })
      const map = [...Object.values(user.map)]
      conn.sendMessage({type: 'SEND_DATA', ...user, fields, buildings, map})
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
