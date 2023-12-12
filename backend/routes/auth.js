const express = require('express');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router();


// CREATE a user using POST "/api/auth" doesn't require AUTH 
router.post('/',
[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })]
    ,async (req,res)=>{

    const errors = validationResult(req);  //validating the fields
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
    let user = await User.findOne({
        email: req.body.email,
    })
    if(user){
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
  
    user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      })
      res.json(user)
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Some Error occured "+error);

    }



})

module.exports = router