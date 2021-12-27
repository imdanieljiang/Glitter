const { AuthenticationError, UserInputError } = require('apollo-server')

const Post = require('../../models/Post.js')
const checkAuth = require('../../util/check_auth.js')

module.exports = {
    Query: {
        async getPosts(){
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            }
            catch (error) {
                throw new Error(error)
            }
        },
        async getPost(_, { postID }) {
            try {
                const post = await Post.findById(postID)
                if (post) {
                    return post
                }
                else {
                    throw new Error('Post not found')
                }
            }
            catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context)
            
            if (body.trim() === '') {
                throw new Error('Post body must not be empty')
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save()
            return post
        },
        async deletePost(_, { postID }, context) {
            const user = checkAuth(context)

            try {
                const post = await Post.findById(postID)
                if (user.username === post.username) {
                    await post.delete()
                    return 'Post deleted successfully'
                }
                else {
                    throw new AuthenticationError('Action not allowed')
                }
            }
            catch (error) {
                throw new Error(error)
            }
        },
        async likePost(_, { postID }, context) {
            const { username } = checkAuth(context)

            const post = await Post.findById(postID)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    // Post already liked, so unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                }
                else {
                    // Not liked, so like it
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                
                await post.save()
                return post
            }
            else {
                throw new UserInputError('Post not found')
            }
        }
    }
}