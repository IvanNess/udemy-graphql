const User = {
    comments: (parent, args, { db }) => {
        return db.comments.filter(comment => comment.author === parent.id)
    }
}

module.exports = User