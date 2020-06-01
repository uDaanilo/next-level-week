import { createServer } from 'http'
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('OK')
})

const server = createServer(app)

server.listen(3000, () => `Running on ${3000}`)
