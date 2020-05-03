import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'

import prisma from '../src/prisma'
import seedDatabase, {userOne, postOne, postTwo} from './utils/seedDatabase'
import getClient from './utils/getClient'

import { getPosts, myPosts, updatePost, createPost, deletePost, subscribeToPosts } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should expose published posts', async()=>{

    const response = await client.query({query: getPosts})
    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
})

test('Should fetch users posts', async ()=>{
    const client = getClient(userOne.jwt)

    const {data} = await client.query({
        query: myPosts
    })

    expect(data.myPosts.length).toBe(2)
})

test('Should be able to update own post', async ()=>{
    const client = getClient(userOne.jwt)

    const variables = {
        id: postOne.post.id, 
        data:{published: false}
    }

    const {data} = await client.mutate({
        mutation: updatePost,
        variables
    })
    const exists = await prisma.exists.Post({id: postOne.post.id, published: false})

    expect(data.updatePost.published).toBe(false)
    expect(exists).toBe(true)
})

test('Should create a post', async()=>{
    const client = getClient(userOne.jwt)

    const variables = {
        title: "userOne post", body:"user one super post", published: true
    }

    const {data} = await client.mutate({
        mutation: createPost, variables
    })
    expect(data.createPost.title).toBe('userOne post')

    const exists =await prisma.exists.Post({title: "userOne post", published: true, author:{id: userOne.user.id}})
    expect(exists).toBe(true)
})

test('Should delete a post', async()=>{
    const client = getClient(userOne.jwt)

    await client.mutate({
        mutation: deletePost,
        variables: {id: postTwo.post.id}
    })

    const exists = await prisma.exists.Post({id: postTwo.post.id})
    expect(exists).toBe(false)
})

test('Should subscribe to changes for published posts', async(done)=>{

    client.subscribe({
        query: subscribeToPosts
    }).subscribe(response=>{
        expect(response.data.post.mutation).toBe('DELETED')
        done()
    })

    await prisma.mutation.deletePost({
        where: {
            id: postTwo.post.id
        }
    })
})