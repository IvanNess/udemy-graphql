const Post = {
  comments: (parent, args, {db})=>{
    return db.comments.filter(comment=>comment.post===parent.id)
  },
  author: (parent, args, {db})=>db.users.find(user=>user.id===parent.author)
}

module.exports = Post