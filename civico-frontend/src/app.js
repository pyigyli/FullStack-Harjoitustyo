const path = require('path')
const express = require('express')
const app = express()
const distFolder = path.resolve(__dirname, '../build')
app.use(express.static(path.resolve(distFolder, 'client')))
const BROWSER_ENV_PREFIX = 'BROWSER_'

app.get('/env.js', (_req, res) => {
	const envStr = Object.keys(process.env)
		.filter(key => key.startsWith(BROWSER_ENV_PREFIX))
		.map(key => `${key.substr(BROWSER_ENV_PREFIX.length)}:'${process.env[key]}'`)
		.join(',')
	res.end(`window.env = {${envStr}}`)
})

// Fallback to index.html
app.get(/^(\/.*)?$/, (_req, res) => {
	res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
	res.header('Pragma', 'no-cache')
	res.header('Expires', '0')
	res.sendFile(path.resolve(distFolder, 'client/index.html'))
})

module.exports = app