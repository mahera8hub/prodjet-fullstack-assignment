const express = require('express')
const router = express.Router()
const waitlistController = require('../controllers/waitlistController')

router.post('/register', waitlistController.register)

module.exports = router
