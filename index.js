//import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer, PubSub } = require('graphql-yoga')
const db = require('./db')
const prisma = require('./prisma')
const {resolvers, fragmentReplacements} = require('./resolvers')

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: request => {
    return {
      db,
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
})

server.start(
  {port: process.env.PORT || 4000}, 
  () => console.log('Server is running on localhost:4000')
)