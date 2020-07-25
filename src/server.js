require('dotenv').config()

const express = require('express')
//const cors = require('cors')
const app = express()

app.use(express.json())
//app.use(cors())

const messagesRouter = require('./routes/messages')
app.use('/messages', messagesRouter)

const port = 3015;
app.listen(port, () => console.log(`server started at port ${port}`))