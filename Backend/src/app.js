const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');



const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'));

const authRouter = require('./routes/auth.routes')


app.use("/api/auth",authRouter)



module.exports = app
