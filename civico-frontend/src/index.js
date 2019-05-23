const app = require('./app')

const port = parseInt(process.env.PORT || '8888', 10)
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})