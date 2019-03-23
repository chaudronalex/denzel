const express = require("express");
const app = express();
const PORT = 9292;
//const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://chaudronalex:phenix96@cluster0-k6q3u.mongodb.net/denzel?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const graphqlHTTP = require('express-graphql');
const {GraphQLSchema} = require('graphql');
const {queryType} = require('./query.js');

const schema = new GraphQLSchema({ query: queryType });

client.connect(err => {
  if (err) return console.log(err)
  const database = client.db("denzel");
  require('./app/routes')(app, database);

  app.use('/graphql', graphqlHTTP({
    schema: schema,
    context: database.collection("movies"),
    graphiql: true,
  }));

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  });
});