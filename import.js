const imdb = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://chaudronalex:phenix96@cluster0-k6q3u.mongodb.net/denzel?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

async function sandbox (actor) {
    try {
      console.log(`📽️  fetching filmography of ${actor}...`);
      const movies = await imdb(actor);
      //const awesome = movies.filter(movie => movie.metascore >= 77);
      
      client.connect(err => {
        const collection = client.db("denzel").collection("movies");
        collection.insert(movies, null, function (error, results) {
          if (error) throw error;
          console.log("The document is inserted");    
      });
        client.close();
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
  
  sandbox(DENZEL_IMDB_ID);