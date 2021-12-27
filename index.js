// Server
const { ApolloServer } = require('apollo-server')
// Database
const mongoose = require('mongoose')


// Imports resolvers
const resolvers = require('./graphql/resolvers')
// MongoDB connection link
const { mongodb } = require('./config.js')
// Imports typedefs
const typeDefs = require('./graphql/typeDefs.js')



const server = new ApolloServer({
    typeDefs,
    resolvers
})

// Connects to the database
mongoose.connect(mongodb, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB is connected!')
        return server.listen({ port: 8080 })
    })
// Connects to the server
    .then(result => {
        console.log(`Server running at ${result.url}`)
    })