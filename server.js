const express = require("express");
const app = express();
const PORT = 9292;
//const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://chaudronalex:phenix96@cluster0-k6q3u.mongodb.net/denzel?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
  if (err) return console.log(err)
  const database = client.db("denzel");
  require('./app/routes')(app, database);

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  });
});



