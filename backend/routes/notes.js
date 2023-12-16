const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get all notes with GET method
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
// ROUTE 2: Add notes with POST method
router.get(
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

module.exports = router;
