const express = require('express')
const router = express.Router()
const {login, register , profile , updateProfile}  = require('../controllers/auth.controller.js') 

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/profile/:id').get(profile).patch(updateProfile)

module.exports = router;