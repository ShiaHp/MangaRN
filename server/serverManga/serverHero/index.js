const express = require('express')
const morgan = require('morgan')
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mangaRouter = require('./routes/manga.route');
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config({
  path : './config.env'
})

app.use(morgan("tiny"));



// app.use(cors());
app.use(bodyParser.json());

app.use(
    cors({
      origin: "http://localhost:19006", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // allow session cookie from browser to pass through
    })
  );


  const connectDB = (url) => {
    return mongoose.connect(url);
  };


  app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.get('/api/v1', (req, res) => {
  res.json({msg : 'API'})
})

app.use('/api/v1/manga',mangaRouter)


const start = async () => {
    try {
      await connectDB('mongodb+srv://shiawase:shiawase@cluster0.h4ezk.mongodb.net/manga?retryWrites=true&w=majority');
      app.listen( process.env.PORT, (req, res) => {
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log(`Connect to DB`);
      });
    } catch (error) {
      console.log(error);
    }
  };

start()