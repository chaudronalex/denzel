const {  GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');
const MongoClient = require("mongodb").MongoClient;
const _ = require('lodash');
const collectionMovie = require('./movies.json');
const uri = "mongodb+srv://chaudronalex:phenix96@cluster0-k6q3u.mongodb.net/denzel?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

const movieType = new GraphQLObjectType({
    name: 'Movie',
    fields:()=>({
        _id: {type:GraphQLString},
        link: {type:GraphQLString},
        id: {type:GraphQLString},
        metascore: {type:GraphQLString},
        poster: {type:GraphQLString},
        rating: {type:GraphQLInt},
        synopsis: {type:GraphQLString},
        title: {type:GraphQLString},
        votes: {type:GraphQLInt},
        year: {type:GraphQLInt}     
    })
});

var collection;
client.connect(err => {    
    collection = client.db("denzel").collection("movies");  
})

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movieID: {
            type: movieType,      
            args: {
                id: { type: GraphQLString }
            },
            resolve: function (source, args) {
                console.log(args.id);
                return _.find(collectionMovie,{id:args.id});
            }
        },
        movie: {
            type: new GraphQLList(movieType) ,         
            resolve: function (source, args) {
                return _.filter(collectionMovie,{metascore:70});
            }
        },
        search:{
            type:new GraphQLList(movieType),
            args:{
                limit:{type:GraphQLInt},
                metascore:{type:GraphQLInt}
            },
            resolve: function(source,args){
                return _.filter(collectionMovie,{metascore:args.metascore})
            }
        }
    }
});

exports.queryType = queryType;