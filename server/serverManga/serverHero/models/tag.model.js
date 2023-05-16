const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");


const TagSchema  = new Schema({
    nameTag: {
        type: String,
        trim: true,
      },
      description: String,
      userId : String,
} ,
 
{
  timestamp : true
})


const Tag = mongoose.model('Tag',TagSchema)
module.exports = Tag