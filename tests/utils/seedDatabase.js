import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


import prisma from '../../src/prisma'

const userOne = {
    input: {
        name: "Jen",
        email: "jen@bk.ru",
        password: bcrypt.hashSync("12345678")
    }, 
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: "Jess",
        email: "jess@bk.ru",
        password: bcrypt.hashSync("12345678")
    }, 
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: "my published post",
        body: '',
        published: true
    },
    post : undefined
}

const postTwo = {
    input: {
        title: "my draft post",
        body: '',
        published: false,
    },
    post : undefined
}

const commentOne = {
    input: {
        text: "A comment one by second user"
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: "A comment two by first user"
    },
    comment: undefined
}

const seedDatabase = async()=>{
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    await prisma.mutation.deleteManyComments()

    userOne.user = await prisma.mutation.createUser({
        data:userOne.input
    })
    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET)

    userTwo.user = await prisma.mutation.createUser({
        data:userTwo.input
    })
    userTwo.jwt = jwt.sign({userId: userTwo.user.id}, process.env.JWT_SECRET)

    postOne.post = await prisma.mutation.createPost({
        data:{
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })

    postTwo.post = await prisma.mutation.createPost({
        data:{
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    })
    
    commentOne.comment = await prisma.mutation.createComment({
        data:{
            ...commentOne.input,
            post: {connect:{
                id: postOne.post.id
            }},
            author:{connect:{
                id: userTwo.user.id
            }}
        }
    })

    commentTwo.comment = await prisma.mutation.createComment({
        data:{
            ...commentTwo.input,
            post: {connect:{
                id: postOne.post.id
            }},
            author:{connect:{
                id: userOne.user.id
            }}
        }
    })

}

export default seedDatabase

export {userOne, postOne, postTwo, userTwo, commentOne, commentTwo}