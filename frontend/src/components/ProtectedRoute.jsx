import React, { useContext } from 'react'
import AppContext from '../contexts/AppContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
  const { user, loadingUser } = useContext(AppContext);
  if (loadingUser) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute
