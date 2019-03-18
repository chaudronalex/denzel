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
      })
    });
    app.get('/movies/:id', (req, res) => {
      const idMovie = req.params.id;
      db.collection("movies").findOne({id:idMovie}, function(err, item) {
        res.send("Title of the searched movie : " + item.title);
      })
    });
    app.get('/movies/search', (req, res) => {
      // const limit = req.params.limit;
      // const metascore = req.params.metascore;
      // db.collection("movies").find()
    })
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