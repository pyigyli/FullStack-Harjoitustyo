import express from 'express'
import http from 'http'
import * as WebSocket from 'ws'
import CivicoServer from './server'
import Connection from './connection'

const server = new CivicoServer()
const app = express()
const httpServer = http.createServer(app)
const wss = new WebSocket.Server({server: httpServer})

wss.on('connection', (ws: WebSocket) => {
  server.addConnection(new Connection(ws))
})

app.get('/', (_req, res) => {
  return res.json({message: 'Hello World!'})
})

const PORT = parseInt(process.env.PORT || '3000', 10)
httpServer.listen(PORT, () => {
  console.log('Server listening on port ' + PORT) // tslint:disable-line:no-console
})
