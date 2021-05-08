const env = require('dotenv')
env.config()
const express = require('express')
const app = express()

const path = require('path')
const currentPath = __dirname

app.use(express.static( currentPath + '/public' ))


app.get('/', (req, res) => {
  res.sendFile(path.join(currentPath, '/index.html'))
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})