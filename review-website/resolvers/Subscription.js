const Subscription = {
    post: {
        subscribe: (parent, args, {pubsub}) =>{
            return pubsub.asyncIterator('post')
        }
    },
    comment: {
        subscribe: (parent, args, {pubsub}) =>{
            return pubsub.asyncIterator('comment')
        }
    }
}

module.exports = Subscription