import express from 'express'
import http from 'http'
import * as WebSocket from 'ws'
import CivicoServer from './server'
import Connection from './connection'

const app = express()
const httpServer = http.createServer(app)
const wss = new WebSocket.Server({server: httpServer})
const server = new CivicoServer()

wss.on('connection', function connection(ws: WebSocket) {
	server.addConnection(new Connection(ws));
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('listening on port 3000')
})