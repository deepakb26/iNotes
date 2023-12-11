const express = require('express');
const User = require('../models/User')
const router = express.Router();


// CREATE a user using POST "/api/auth" doesn't require AUTH 
router.post('/',(req,res)=>{

    console.log(req.body);
    const user = User(req.body);
    user.save()
    res.send(req.body)
})

module.exports = router