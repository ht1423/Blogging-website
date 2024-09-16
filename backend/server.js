const express = require('express')
const connectDB = require('./db')
const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
const cors = require('cors')

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.MONGO_URI,
    credentials: true
}))

app.use('/api/users', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/users', require('./routes/followRoutes'))
app.use('/api/users', require('./routes/blogRoutes'))

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})

