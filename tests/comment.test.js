import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'

import prisma from '../src/prisma'
import seedDatabase, {userOne, commentOne, commentTwo, postOne} from './utils/seedDatabase'
import getClient from './utils/getClient'

import { deleteComment, subscribeToComments } from './utils/operations'

beforeEach(seedDatabase)

const client = getClient()

test('Should delete own comment', async()=>{
    const client = getClient(userOne.jwt)

    const variables = {id: commentTwo.comment.id}

    const response = await client.mutate({
        mutation: deleteComment, variables
    })
    expect(response).resolves

    const exists = await prisma.exists.Comment({id: commentTwo.comment.id})
    expect(exists).toBe(false)
})

test('Should not delete other users comment', async()=>{
    const client = getClient(userOne.jwt)

    const variables = {id: commentOne.comment.id}

    await expect(
        client.mutate({mutation: deleteComment, variables})
    ).rejects.toThrow()
})

test('Should subcribe to coments for a post',async (done)=>{
    const variables = {
        postId: postOne.post.id
    }

    client.subscribe({
        query: subscribeToComments,
        variables
    }).subscribe({next: (response)=>{
        //assertion
        expect(response.data.comment.mutation).toBe("DELETED")
        done()
    }})

    //Change a comment
    await prisma.mutation.deleteComment({where: {id: commentOne.comment.id}})
})