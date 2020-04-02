const { Prisma } = require('prisma-binding')

const prisma = new Prisma({
    typeDefs: 'generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
})

module.exports = prisma

// prisma.query.users(null, '{ id name email }').then(data=>{
//     console.log(data)
// })

// prisma.query.comments(null, '{id text author{id name}}').then(data=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })

// const updatePostForUser = async(postID, data)=>{
//     const res = await prisma.mutation.updatePost({
//         where: {
//             id: postID
//         },
//         data: {...data}
//     }, '{author{id}}')
//     const authorId = res.author.id
//     const author = await prisma.query.user({
//         where: {
//             id: authorId
//         }
//     }, '{id name email}')
//     return author
// }

// updatePostForUser('ck88ouv5f007c0737z8mqnog5', {body: 'new body'})
//     .then(data=>{
//         console.log(data)
//     })
//     .catch(err=>console.log('err', err))

// prisma.mutation.createPost({
//     data: {
//         title: 'new one',
//         body: 'body',
//         published: false,
//         author: {
//             connect: {
//                 email: 'vic@bk.ru'
//             }
//         }
//     }
// }, '{id title body published}')
//     .then(data => {
//         console.log('data')
//         return prisma.query.posts(null, '{id title body published}')
//     })
//     .then(data => console.log(JSON.stringify(data, undefined, 2)))
//     .catch(err => {
//         console.log('err', err)
//     })

// prisma.mutation.updatePost({
//     where:{
//         id: 'ck88ouv5f007c0737z8mqnog5'
//     },
//     data: {
//         published: true,
//     }
// }, '{id title body published}')
//     .then(data => {
//         console.log('data')
//         return prisma.query.posts(null, '{id title body published}')
//     })
//     .then(data => console.log(JSON.stringify(data, undefined, 2)))
//     .catch(err => {
//         console.log('err', err)
//     })