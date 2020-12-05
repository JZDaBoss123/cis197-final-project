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
      res.json({code : "success"})
    } else {
      res.json({code : "fail"})
    }
  })
})

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.username = ''
  req.session.password = ''
  res.send('user logged out')
})

router.post('/isLogged', async (req, res) => {
  if (req.session.username === null || req.session.password === null) {
    res.json({in : false, user : ""})
  } else {
    if (req.session.username !== "" && req.session.password !== "") {
      res.json({in : true, user : req.session.username})
    } else {
      res.json({in : false, user : ""})
    }
  }
})

module.exports = router