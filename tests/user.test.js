import 'cross-fetch/polyfill'
import '@babel/polyfill/noConflict'

import prisma from '../src/prisma'
import seedDatabase, {userOne} from './utils/seedDatabase'
import getClient from './utils/getClient'

import {createUser, getUsers, getProfile, login} from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async ()=>{
    const variables = {data:{
        name: "tea",
        email: "tea@bk.ru",
        password: "12345678"
    }}

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const isUserExist = await prisma.exists.User({id: response.data.createUser.user.id})
    expect(isUserExist).toBeTruthy()
})

test('Should expose public author profiles', async ()=>{

    const response = await client.query({
        query: getUsers
    })

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
})

test('Should not login with bad credentials', async()=>{
    const variables={
        name: "Jan",
        email: "jan@bk.ru",
        password:"11372000000"        
    }

    await expect(client.mutate({
        mutation:login,
        variables
    })).rejects.toThrow()
})

test('Should not sign up with short password', async()=>{

    const variables = {data:{
        name: "tee",
        email: "tee@bk.ru",
        password: "123456"
    }}

    await expect(
        client.mutate({mutation: createUser, variables})
    ).rejects.toThrow()

})

test('Should fetch user profile', async ()=>{
    const client = getClient(userOne.jwt)

    const {data} = await client.query({
        query: getProfile
    })

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})