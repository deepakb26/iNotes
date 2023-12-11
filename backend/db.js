const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017";

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