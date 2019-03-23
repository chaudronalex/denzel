const imdb = require('../../src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

module.exports = function(app, db) {
    app.get('/movies/populate', (req, res) => {
      sandbox(DENZEL_IMDB_ID, db);
      res.send("The movies have been inserted in the database");
    });
    app.get('/movies', (req, res) => {
      db.collection("movies").find({"metascore":{$gte:70}}).toArray(function(err, awesome) {
        var rand = getRandomInt(0, awesome.length);
        res.send("Title of an awesome movie : " + awesome[rand].title + "\nmetascore : " + awesome[rand].metascore);
      });
    });
    app.get('/movies/search', (req, res) => {
      var limit;
      if(req.params.limit != null) {
        limit = req.query.limit;
      }
      else {
        limit = 5;
      }
      var metascore;
      if(req.params.metascore != null) {
        metasc = req.query.metascore;
      }
      else {
        metascore = 5;
      }
      db.collection("movies").find({"metascore":{$gte:metascore}}).sort({"metascore":-1}).limit(limit).toArray(function(err, results) {
        res.send(results);
      });
    });
    app.get('/movies/:id', (req, res) => {
      const idMovie = req.params.id;
      db.collection("movies").findOne({id:idMovie}, function(err, item) {
        res.send("Title of the searched movie : " + item.title);
      });
    });
    app.post("/movies/:id", (req, res) => {
      db.collection("movies").updateOne({"id":req.params.id}, {$set:{date:req.body.date, review:req.body.review}},(err, result) => {             
          response.send(result)          
      });
    });
};

async function sandbox (actor, db) {
    try {
      console.log(`📽️  fetching filmography of ${actor}...`);
      const movies = await imdb(actor);

      const collection = db.collection("movies");
      collection.insert(movies, null, function (error, results) {
        if (error) throw error;
        console.log("The movies have been inserted in the database");    
      });
    } catch (e) {
      console.error(e);
    }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}