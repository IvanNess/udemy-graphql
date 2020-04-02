const jwt = require('jsonwebtoken')

const getUserId = (request, requireAuth = true) => {
    const header = request.request ?
        request.request.headers.authorization :
        request.connection.context.authorization

    if (header) {
        const token = header.replace('bearer ', '')
        const user = jwt.verify(token, 'thisisasecret')
        return user.userId
    }
    if (requireAuth)
        throw new Error('authorization required')

    return null
}

module.exports = getUserId