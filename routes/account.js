const express = require('express')

const User = require('../models/user')
const isAuthenticated = require('../middlewares/isAuthenticated')

const router = express.Router()

router.post('/signup', async (req, res) => {
    const { username, password } = req.body
    try {
      await User.create({ username, password })
      res.send('user created succesfully')
    } catch {
      res.send('failure occurs when creating the user')
    }
  })

router.post('/login', (req, res) => {
  const { username, password } = req.body

  User.findOne({ username, password }, (err, user) => {
    if (user) {
      req.session.username = username
      req.session.password = password
      res.send(`logged in`)
    } else {
      res.send(`failed to log in`)
    }
  })
})

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.username = ''
  req.session.password = ''
  res.send('user logged out')
})

module.exports = router