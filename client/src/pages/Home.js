import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid } from 'semantic-ui-react'

import { AuthContext } from '../context/auth.js'
import PostCard from '../components/PostCard.js'
import PostForm from '../components/PostForm.js'
import { FETCH_POSTS_QUERY } from '../util/graphql.js'

function Home() {

    const { user } = useContext(AuthContext)

    const { loading, data } = useQuery(FETCH_POSTS_QUERY)

    let posts = <h1>Loading posts...</h1>
    if (!loading) {
        posts = data.getPosts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post}/>
            </Grid.Column>
        ))
    }

    let postForm = null
    if (user) {
        postForm = 
        <Grid.Column>
            <PostForm/>
        </Grid.Column>
    }

    return (
        <Grid columns={3}>
            <Grid.Row className='home-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {postForm}
                {posts}
            </Grid.Row>
        </Grid>
    )
}

export default Home