//import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer, PubSub } = require('graphql-yoga')
const db = require('./db')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const User = require('./resolvers/User')
const Post = require('./resolvers/Post')
const Comment = require('./resolvers/Comment')
const prisma = require('./prisma')

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db, 
    pubsub, 
    prisma
  }
})

server.start(() => console.log('Server is running on localhost:4000'))