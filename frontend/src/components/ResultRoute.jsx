import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import AppContext from '../contexts/AppContext';

const ResultRoute = ({children}) => {
  const { status } = useContext(AppContext);

//   if (!status) return <p>Loading...</p>;

  if (status === "Submitted") {
    return <Navigate to="/result" replace />;
  }

  return children;
}

export default ResultRoute
