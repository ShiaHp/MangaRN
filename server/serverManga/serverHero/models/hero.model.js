const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const HeroSchema  = new Schema({
    name: {
        type: String,
        trim: true,
        index : true
        // required: [true, "Hero name is required"]
      },
      image: {
        type: String,
      },
      id : {
        type : Number
      },
      ability: {
        type : String 
      },
      address : {
        type : String,
      },
      age : {
        type : String
      },
      gender :{
        type : String,
        enum : ['Male', 'Female','Other'],
        default : 'Male'
      },
      email : {
        type : String
      },
      user: String,
      tag :   {
        type: [String]
      },
} ,
 
{
  timestamp : true
})


const Hero = mongoose.model('Hero',HeroSchema)
module.exports = Hero