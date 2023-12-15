const express = require('express');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = '$noopDawg';

// ROUTE 1: CREATE a user using POST "/api/auth" doesn't require AUTH 
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
    const salt = await bcrypt.genSalt(10);
    const securePass = await bcrypt.hash(req.body.password, salt);  //encrypts password
    user = await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
      })
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
  
  
      // res.json(user)
      res.json({authtoken})
    }
    catch(error){
        console.error(error.message);
        res.status(500).res.status(500).send("Internal Server Error"+error);

    }

})

// ROUTE 2: LOGIN with USER
router.post('/login', [ 
    body('email', 'Enter a valid email').isEmail(),  //checks email format
    body('password', 'Password cannot be blank').exists(),  //checks for empty vals
  ], async (req, res) => {
  
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {email, password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
  
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({error: "Please try to login with correct credentials"});
      }
  
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({authtoken})
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  
  
  })

  // ROUTE 3: Logged in details

  router.post('/getuser', fetchuser, async (req, res) =>{
    try {
        var userID = req.user.id
        const user = await User.findById(userID).select("-password")
        res.send(user)
        
      } catch (error) {
            console.error(error.message)
            console.log("Internal server error")
      }
  })

module.exports = router;