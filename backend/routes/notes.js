const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all notes with GET method, READ
router.get("/allnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  // const notes = await Notes.find({user:req.user.id})
  // res.json(notes);
});
// ROUTE 2: Add notes with POST method CREATE
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ], async (req, res) => {
    try {
      const { title, description, tag } = req.body; //destruct the values

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({  //create a new object of schema Notes with the parsed values from the body of req
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save(); //save the note

      res.json(savedNote); //send the saved note

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)

//3rd route where we can UPDATE notes. use PUT. requires user login

router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const {title, description, tag} = req.body;

  const newNote  = {};
  if(title){newNote.title = title};  //if a new title exists then add it to the object. similar for desc and tag too
  if(description){newNote.description = description}; 
  if(tag){newNote.tag = tag};

  // Find the note to be updated and update it
  let note = await Notes.findById(req.params.id);
  if(!note){return res.status(404).send("Not Found")}  //if no note exists with that id 

  if(note.user.toString() !== req.user.id){ //match the user id again 
      return res.status(401).send("Not Allowed");
  }

  note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})  // find and update proper note
  res.json({note});

  })

  
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
 
  try {
    // Find the note to be deleted
    let note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", note: note });
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}


  })

module.exports = router;


module.exports = router;
