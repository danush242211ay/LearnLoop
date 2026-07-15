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
const instructorRouter = require('./routes/instructor.routes')
const enrollmentRouter = require('./routes/enrollment.routes')

app.use("/api/auth",authRouter)
app.use("/api/course",courseRouter)
app.use("/api/instructor",instructorRouter)
app.use("/api/enroll",enrollmentRouter)


module.exports = app
