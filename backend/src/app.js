const express = require('express')
const cors = require('cors')
const waitlistRoutes = require('./routes/waitlist')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/waitlist', waitlistRoutes)

// catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

module.exports = app
