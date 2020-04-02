const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getUserId = require('../utils/getUserId')
const generateToken = require('../utils/generateToken')
const hashPassword = require('../utils/hashPassword')

const Mutation = {
    createComment: async (parent, args, { prisma, request }, info) => {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.post,
            published: true
        })
        if (!postExists)
            throw new Error('no post found')
        return prisma.mutation.createComment({
            data: {
                text: args.text, 
                author: { connect: { id: userId } },
                post: { connect: { id: args.post } }
            }
        }, info)
    },
    updateComment: async (parent, { id, data }, { prisma, request }, info) => {
        const userId = await getUserId(request)

        const commentExists = await prisma.exists.Comment({ 
            id,
            author:{
                id: userId
            }
        })
        if (!commentExists) throw new Error('you can not update this comment')

        return prisma.mutation.updateComment({
            where: { id },
            data
        }, info)
    },
    deleteComment: async (parent, { id }, { prisma, request }, info) => {
        const userId = await getUserId(request)

        const commentExists = await prisma.exists.Comment({ 
            id,
            author:{
                id: userId
            } 
        })
        if (!commentExists) throw new Error('you can not delete this comment')

        return prisma.mutation.deleteComment({ where: { id } }, info)
    },


    createUser: async (parent, args, { prisma }, info) => {
        const userExists = await prisma.exists.User({ email: args.data.email })
        if (userExists)
            throw new Error('email taken.')
        const password = await hashPassword(args.data.password)
        const user = await prisma.mutation.createUser({ data: { ...args.data, password } })
        const token = generateToken(user.id)
        return { user, token }
    },

    login: async (parent, args, { prisma }, info) => {
        const user = await prisma.query.user({ where: { email: args.email } })
        if (!user)
            throw new Error('User or password is incorrect.')
        const isPasswordMatched = await bcrypt.compare(args.password, user.password)
        if (!isPasswordMatched)
            throw new Error("User or password is incorrect.")
        return {
            user,
            token: generateToken(user.id)
        }
    },

    updateUser: async(parent, args, { prisma, request }, info) => {
        const userId = getUserId(request)

        if(typeof args.data.password === 'string'){
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: { id: userId },
            data: args.data
        }, info)
    },

    deleteUser: async (parent, args, { prisma, request }, info) => {
        const userId = getUserId(request)

        const userExists = await prisma.exists.User({ id: userId })
        if (!userExists)
            throw new Error('user not found')
        return prisma.mutation.deleteUser({ where: { id: userId } }, info)
    },

    createPost: (parent, { title, body, published }, { prisma, request }, info) => {
        const userId = getUserId(request)

        return prisma.mutation.createPost({
            data: {
                title,
                body,
                published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            }
        }, info)
    },
    updatePost: async (parent, { id, data }, { prisma, request }, info) => {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        })
        if (!postExists) throw new Error('No post found')
        const isPublished = await prisma.exists.Post({
            id,
            published: true
        })
        if(isPublished && data.published===false){
            await prisma.mutation.deleteManyComments({
                where:{
                    post:{
                        id
                    }
                }
            })
        }
        return prisma.mutation.updatePost({ where: { id }, data }, info)
        // if(originPost.published && !updated.published){
        //     pubsub.publish('post', {
        //         post:{
        //             mutation: 'DELETED',
        //             data: updated
        //         }
        //     })
        // } else if(!originPost.published && updated.published){
        //     pubsub.publish('post', {
        //         post:{
        //             mutation: 'CREATED',
        //             data: updated
        //         }
        //     })
        // } else{
        //     pubsub.publish('post', {
        //         post:{
        //             mutation: 'UPDATED',
        //             data: updated
        //         }
        //     })
        // }
    },
    deletePost: async (parent, args, { prisma, request }, info) => {
        const userId = getUserId(request)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })
        if (!postExists) throw new Error('No post found.')
        return prisma.mutation.deletePost({ where: { id: args.id } }, info)
    }
}

module.exports = Mutation