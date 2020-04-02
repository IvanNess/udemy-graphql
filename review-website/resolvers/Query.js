const Query = {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    posts: (parent, args, { db }) => {
        if (!args.query)
            return db.posts
        return db.posts.filter(post => {
            return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments: (_, __, { db }) => {
        return db.comments
    },
    users: (_, __, { db }) => {
        return db.users
    }
}

module.exports = Query