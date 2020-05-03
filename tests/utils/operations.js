import {gql} from 'apollo-boost'

const createUser = gql`mutation($data:createUserInput!){
    createUser(data:$data){
        user{
            id
            name
            email
        }
        token
    }
}`

const getUsers = gql`query{
    users{
        id
        name
        email
    }
}`

const login = gql`mutation($email: String!, $password: String!){
    login(
        email: $email,
        password: $password
    ){
        user{
            id
            name
            email
        }
        token
    }
}`

const getProfile = gql`query{
    me{
        id
        name
        email
    }
}`

const getPosts = gql`query{
    posts{
        id
        title
        body
        published
    }
}`

const myPosts = gql`query{
    myPosts{
        id
        title
        body
        published
    }
}`

const updatePost = gql`mutation($id: ID!, $data: UpdatePostInput){
    updatePost(id: $id, data:$data){
        id
        title
        body
        published
    }
}`

const createPost = gql`mutation($title:String!, $body:String!, $published: Boolean!){
    createPost(title: $title, body:$body, published: $published){
        id
        title
        body
        published
    }
}`

const deletePost = gql`mutation($id: ID!){
    deletePost(id: $id){
        id
    }
}`

const deleteComment = gql`mutation($id: ID!){
    deleteComment(id: $id){
        id
        text
    }
}`

const subscribeToComments = gql`subscription($postId: ID!){
    comment(postId: $postId){
        mutation
        node{
            id
            text
        }
    }
}`

const subscribeToPosts = gql`subscription{
    post{
        mutation
        node{
            id
            title
        }
    }
}`

export {
    createUser,
    getUsers,
    login,
    getProfile,
    getPosts,
    myPosts,
    updatePost,
    createPost,
    deletePost,
    deleteComment,
    subscribeToComments,
    subscribeToPosts
}
