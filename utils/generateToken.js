const jwt = require('jsonwebtoken')

const generateToken = userId =>{
    return jwt.sign({ userId }, 'thisisasecret', {expiresIn: '7 days'})
}

module.exports = generateToken