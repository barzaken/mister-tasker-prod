const express = require('express')
const {login, signup, logout, getLoggedUser} = require('./auth.controller')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)
router.get('/', getLoggedUser)
module.exports = router