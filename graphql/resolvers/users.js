// Password encryption
const bcrypt = require('bcryptjs')
// JSON web token
const jwt = require('jsonwebtoken')
// User input error (like username already exists)
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators.js')
const { secret_key } = require('../../config.js')
const User = require('../../models/User.js')

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        secret_key,
        {
            expiresIn: '1h'
        })
}

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password)

            if (!valid) {
                throw new UserInputError('Error', { errors })
            }

            const user = await User.findOne({ username })

            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }
            
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
        )   {
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            // Make sure user doesn't already exist
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'Username is taken'
                    }
                })
            }
            // Hash the password and create an auth token
            password = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const result = await newUser.save()

            const token = generateToken(result)

            return {
                ...result._doc,
                id: result._id,
                token
            }
        }
    }
}