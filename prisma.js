const { Prisma } = require('prisma-binding')

const {fragmentReplacements} = require('./resolvers')

const prisma = new Prisma({
    typeDefs: 'generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements

})

module.exports = prisma
