const users = [
    {
        id: '12',
        name: 'Andrew',
        email: 'andrew@example.com',
        age: 27
    },
    {
        id: '13',
        name: 'Frankie',
        email: 'frankie@example.com',
        age: 33
    },
    {
        id: '14',
        name: 'Luka',
        email: 'luka@example.com'
    }
]

const posts = [
    {
        id: '53',
        title: 'post1',
        body: 'dfvcce red white four ddd b dfree free vfd dddddd',
        published: true,
        author: '12'

    },
    {
        id: '54',
        title: 'two',
        body: 'dfvcce red two two white ddd b dfree vfd dddddd',
        published: false,
        author: '13'
    },
    {
        id: '55',
        title: 'post3',
        body: 'dfvcce red white ddd one three four b dfree free vfd dddddd',
        published: true,
        author: '14'
    },
]

const comments = [
    {
        id: '34',
        text: 'Great!!!',
        author: '12',
        post: '53'
    },
    {
        id: '35',
        text: 'not bad...',
        author: '13',
        post: '53'
    },
    {
        id: '36',
        text: 'cool',
        author: '13',
        post: '55'
    },
    {
        id: '37',
        text: 'the first one.',
        author: '12',
        post: '54'
    }
]

const db = {users, posts, comments}

module.exports = db
