import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Feed, Grid } from 'semantic-ui-react'

import PostCard from '../components/PostCard.js'

function Home() {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY)

    let posts = <h1>Loading posts...</h1>
    if (!loading) {
        posts = data.getPosts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post}/>
            </Grid.Column>
        ))
    }

    return (
        <Grid columns={3}>
            <Grid.Row className='home-title'>
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {posts}
            </Grid.Row>
        </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`

export default Home