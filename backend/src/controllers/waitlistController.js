const waitlistService = require('../services/waitlistService')

async function register(req, res) {
  try {
    const result = await waitlistService.registerUser(req.body)
    return res.status(201).json(result)
  } catch (err) {
    // validation errors we throw ourselves come with a 400 status
    if (err.isValidation) {
      return res.status(400).json({ error: err.message })
    }
    console.error('Unexpected error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}

module.exports = { register }
