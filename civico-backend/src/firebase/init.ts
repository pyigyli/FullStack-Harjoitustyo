import firebase from 'firebase/app'
import 'firebase/database'
import {apiKey, databaseURL} from './secret'
// secret.ts is ignored by git

const config = {
  apiKey,
  databaseURL
}

firebase.initializeApp(config)

export default firebase.database()