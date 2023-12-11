const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/iNotes";

const connectToMongo = () =>{
    try{
        mongoose.connect(mongoURI)
        console.log("connected to db")
    }
    catch(e){
        console.log("failed")
    }
    // console.log("hello");
}

module.exports = connectToMongo;