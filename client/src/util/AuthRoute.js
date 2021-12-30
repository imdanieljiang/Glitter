import React, { useContext } from 'react'
import { Route, Navigate, Outlet } from 'react-router-dom'

import { AuthContext } from '../context/auth.js'

function AuthRoute() {
    const { user } = useContext(AuthContext)

    return user ? <Navigate to='/'/> : <Outlet/>
}

export default AuthRoute