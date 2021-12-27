const { AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken')
const { secret_key } = require('../config.js')

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization
    if (authHeader) {
        // Bearer ...
        const token = authHeader.split('Bearer ')[1]
        if (token) {
            try {
                const user = jwt.verify(token, secret_key)
                return user
            }
            catch (error) {
                throw new AuthenticationError('Invalid/expired token')
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authorization header must be provided')
}