import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from './init'
import Connection from '../connection'

export const createNewAccount = async (conn: Connection, username: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const ref = db.ref(`users`).push({username, passwordHash})
  const user = await ref.once('value')
  conn.id = user.key
  conn.username = user.child('username').val()
}

export const login = async (conn: Connection, username: string, password: string) => {
  const user = await db.ref('users').orderByChild('username').equalTo(username).once('value')
  const userJSON = user.toJSON()
  if (userJSON) {
    if (bcrypt.compare(password, Object.values(userJSON)[0].passwordHash)) {
      const authorizedUser = {id: user.key, username: user.child('username')}
      const token = `Bearer ${jwt.sign(authorizedUser, process.env.SECRET || 'dev-mode')}`
      return token
    } else {
      console.log('Username or password wrong')
    }
  }
}