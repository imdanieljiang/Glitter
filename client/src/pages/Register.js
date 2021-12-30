import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth.js'
import { useForm } from '../util/hooks.js'

function Register() {

    const context = useContext(AuthContext)

    let navigate = useNavigate()

    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData } }) {
            context.login(userData)
            navigate('/')
        },
        onError(error) {
            setErrors(error.graphQLErrors[0].extensions.errors)
        },
        variables: values
    })

    function registerUser(){
        addUser()
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input
                label='Username'
                placeholder='Username'
                name='username'
                type='text'
                value={values.username}
                error={errors.username ? true : false}
                onChange={onChange}
                />
                <Form.Input
                label='Email'
                placeholder='Email'
                name='email'
                type='email'
                value={values.email}
                error={errors.email ? true : false}
                onChange={onChange}
                />
                <Form.Input
                label='Password'
                placeholder='Password'
                name='password'
                type='password'
                autoComplete='on'
                value={values.password}
                error={errors.password ? true : false}
                onChange={onChange}
                />
                <Form.Input
                label='Confirm Password'
                placeholder='Confirm Password'
                name='confirmPassword'
                type='password'
                autoComplete='on'
                value={values.confirmPassword}
                error={errors.confirmPassword ? true : false}
                onChange={onChange}
                />
                <Button type='submit' primary>
                    Register
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className='ui error message'>
                    <ul className='list'>
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Register