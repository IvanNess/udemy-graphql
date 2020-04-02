const {extractFragmentReplacements} = require('prisma-binding')

const Query = require('./Query')
const Mutation = require('./Mutation')
const Subscription = require('./Subscription')
const User = require('./User')
const Post = require('./Post')
const Comment = require('./Comment')

const resolvers =  {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

module.exports.resolvers = resolvers
module.exports.fragmentReplacements = fragmentReplacements