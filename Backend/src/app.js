const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');



const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'));

/* rotues */
const authRouter = require('./routes/auth.routes')
const courseRouter = require('./routes/course.routes')


app.use("/api/auth",authRouter)
app.use("/api/course",courseRouter)


module.exports = app
