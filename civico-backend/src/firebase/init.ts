import firebase from 'firebase/app'
import 'firebase/database'

const config = {
  apiKey: 'AAAAEL_zR7E:APA91bHpUBbYRpG0rbkYJG3WALNQTPwKn2oW-U8hC-veNev_IzJQNvfWzvL7CapVSG7O-IYl6Nn9Rxkdf1lxEf9tVKi9JGjwvItXG3Rh_JazmlmMQdBl9wjgskhjOhA7P-FfHVgalXDb',
  databaseURL: 'https://civico-database.firebaseio.com'
}

firebase.initializeApp(config)

export default firebase.database()