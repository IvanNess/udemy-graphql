const uuidv4 = require('uuid/v4')

const Mutation = {
    createComment: (parent, args, { db, pubsub }) => {
        const isUser = db.users.some(user => user.id === args.author)
        if (!isUser) throw new Error('No User!')
        const isPost = db.posts.some(post => post.id === args.post && post.published)
        if (!isPost) throw new Error('No Post!')
        const comment = { ...args, id: uuidv4() }
        db.comments.push(comment)
        pubsub.publish('comment', {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return comment
    },
    updateComment: (parent, { id, data }, { db, pubsub }) => {
        let commentIdx = db.comments.findIndex(comment => comment.id === id)
        if (!commentIdx === -1) throw new Error('No comment found')
        const updated = { ...db.comments[commentIdx], ...data }
        db.comments[commentIdx] = updated
        pubsub.publish('comment', {
            comment: {
                mutation: 'UPDATED',
                data: updated
            }
        })
        return updated
    },
    deleteComment: (parent, args, { db, pubsub }) => {
        const delIdx = db.comments.findIndex(comment => comment.id === args.id)
        if (delIdx === -1) throw new Error('No comment found.')
        const [deleted] = db.comments.splice(delIdx, 1)
        pubsub.publish('comment', {
            comment: {
                mutation: 'DELETED',
                data: deleted
            }
        })
        return deleted
    },
    createPost: (parent, args, { db, pubsub }) => {
        const authorExists = db.users.find(user => user.id === args.author)
        if (!authorExists) throw new Error('No user found')
        const post = { id: uuidv4(), ...args }
        if (args.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATE',
                    data: post
                }
            })
        }
        db.posts.push(post)
        return post
    },
    updatePost: (parent, { id, data }, { db, pubsub }) => {
        const postIdx = db.posts.findIndex(post => post.id === id)
        if (postIdx === -1) throw new Error('No post found')
        const originPost = {...db.posts[postIdx]}
        const updated = {...db.posts[postIdx], ...data}
        if(originPost.published && !updated.published){
            pubsub.publish('post', {
                post:{
                    mutation: 'DELETED',
                    data: updated
                }
            })
        } else if(!originPost.published && updated.published){
            pubsub.publish('post', {
                post:{
                    mutation: 'CREATED',
                    data: updated
                }
            })
        } else{
            pubsub.publish('post', {
                post:{
                    mutation: 'UPDATED',
                    data: updated
                }
            })
        }
        return db.posts[postIdx] = updated
    },
    deletePost: (parent, args, { db, pubsub }) => {
        const delIdx = db.posts.findIndex(post => post.id === args.id)
        if (delIdx === -1) throw new Error('No post found.')
        const [deleted] = db.posts.splice(delIdx, 1)
        db.comments = db.comments.filter(comment => comment.post !== args.id)
        if(deleted.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deleted
                }
            })
        }
        return deleted
    }
}

module.exports = Mutation