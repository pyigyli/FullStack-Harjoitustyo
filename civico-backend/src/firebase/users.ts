import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './init'
import Connection from '../connection'

export const createNewAccount = async (conn: Connection, username: string, password: string) => {
  const findDuplicateUser = await db.ref('users').orderByChild('username').equalTo(username).once('value')
  if (findDuplicateUser.toJSON()) {
    conn.sendMessage({type: 'ERROR', message: 'Username already taken.'})
    return false
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const ref = db.ref(`users`).push({username, passwordHash})
  const user = await ref.once('value')
  conn.id = user.key || ''
  conn.username = user.child('username').val()
  return true
}

export const login = async (conn: Connection, username: string, password: string) => {
  const user = await db.ref('users').orderByChild('username').equalTo(username).once('value')
  const userJSON = user.toJSON()
  if (userJSON && await bcrypt.compare(password, Object.values(userJSON)[0].passwordHash)) {
    const id = Object.keys(userJSON)[0]
    const token = `Bearer ${jwt.sign(id, process.env.SECRET || 'DEVELOPMENT')}`
    await db.ref(`users/${id}/token`).set(token)
    conn.token = token
    return token
  }
  return null
}

export const logout = (conn: Connection, id: string) => {
  db.ref(`users/${id}/token`).remove()
  conn.id = ''
  conn.username = ''
}
