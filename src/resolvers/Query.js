import getUserId from '../utils/getUserId'

const Query = {
    me: (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request)
        return prisma.query.user({ where: { id: userId } }, info)
    },

    post: async (parent, { id }, { request, prisma }, info) => {
        const userId = getUserId(request, false)

        const post = await prisma.query.posts({
            where: {
                id,
                OR: [
                    {
                        author: {
                            id: userId
                        }
                    },
                    { published: true }
                ]
            }
        }, info)

        if (post.length === 0)
            throw new Error('no post to view')
        return post[0]
    },

    hello: (_, { name }) => `Hello ${name || 'World'}`,

    posts: (parent, args, { prisma, request }, info) => {
        // if (!args.query)
        //     return db.posts
        // return db.posts.filter(post => {
        //     return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
        // })
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
            where: {
                published: true
            }
        }
        if (args.query) {
            opArgs.where.OR = [
                { title_contains: args.query },
                { body_contains: args.query }
            ]
        }

        return prisma.query.posts(opArgs, info)
    },

    myPosts: (parent, args, { request, prisma }, info) => {
        const userId = getUserId(request)
        const opArgs = {
            first: args.first,
            skip: args.skip, 
            after: args.after,
            orderBy: args.orderBy,
            where: {
                author: {
                    id: userId
                }
            }
        }
        if (args.query) {
            opArgs.where.OR = [
                { title_contains: args.query },
                { body_contains: args.query }
            ]
        }
        return prisma.query.posts(opArgs, info)
    },

    comments: async (parent, args, { prisma }, info) => {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy,
        }
        const res = await prisma.query.comments(opArgs, info)
        return res
        //return prisma.query.comments(null, info)
    },

    users: async (parent, args, { prisma }, info) => {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        }
        if (args.query) {
            opArgs.where = {
                name_contains: args.query
            }
        }

        const users = await prisma.query.users(opArgs, info)

        return users
    }
}

export default Query