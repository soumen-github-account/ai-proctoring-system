
import React, { Children, useContext } from 'react'
import AppContext from '../contexts/AppContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => {

    const {token} = useContext(AppContext);
    if(token) return <Navigate to='/' replace />

  return children;
}

export default PrivateRoute
