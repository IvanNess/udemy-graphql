const bcrypt = require('bcryptjs')

const hashPassword = (password) => {
    if (password.length <= 8)
        throw new Error('password must bt 8 characters or longer.')
    return bcrypt.hash(password, 10)
}

module.exports = hashPassword