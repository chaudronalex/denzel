const imdb = require('../../src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';

module.exports = function(app, db) {
    app.get('/movies/populate', (req, res) => {
        sandbox(DENZEL_IMDB_ID, db);
        res.send("The movies have been inserted in the database");
    });
};

async function sandbox (actor, db) {
    try {
      console.log(`📽️  fetching filmography of ${actor}...`);
      const movies = await imdb(actor);
      //const awesome = movies.filter(movie => movie.metascore >= 77);
      
      const collection = db.collection("movies");
      collection.insert(movies, null, function (error, results) {
        if (error) throw error;
        console.log("The movies have been inserted in the database");    
      });
    } catch (e) {
      console.error(e);
    }
}