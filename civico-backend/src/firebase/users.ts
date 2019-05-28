import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './init'
import Connection from '../connection'

export const createNewAccount = async (conn: Connection, username: string, password: string) => {
  try {
    const findDuplicateUser = await db.ref('users').orderByChild('username').equalTo(username).once('value')
    if (findDuplicateUser.toJSON()) {
      conn.sendMessage({type: 'ERROR', message: 'Username already taken.'})
      return false
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const ref = db.ref(`users`).push({username, passwordHash})
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

export const getBasicUserInfo = async (conn: Connection) => {
  try {
    const user = await db.ref(`users/${conn.id}`).once('value')
    const userJSON = user.toJSON()
    if (userJSON) {
      conn.sendMessage({
        type: 'BASIC',
        population: Object.values(userJSON)[0].population ? Object.values(userJSON)[0].population : 1,
        lumberRate: Object.values(userJSON)[0].lumberRate ? Object.values(userJSON)[0].lumberRate : 2,
        ironRate: Object.values(userJSON)[0].ironRate   ? Object.values(userJSON)[0].ironRate   : 2,
        clayRate: Object.values(userJSON)[0].clayRate   ? Object.values(userJSON)[0].clayRate   : 2,
        wheatRate: Object.values(userJSON)[0].wheatRate  ? Object.values(userJSON)[0].wheatRate  : 2,
        buildings: Object.values(userJSON)[0].buildings  ? Object.values(userJSON)[0].buildings  : {}
      })
    }
  } catch (err) {
    conn.sendMessage({type: 'ERROR', message: 'Unable to reach database.'})
    console.error(err) // tslint:disable-line:no-console
  }
}
