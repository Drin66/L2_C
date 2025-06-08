import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/Auth';

const ProtectedRoute = ({ children }) => {
  const user = isLoggedIn();
  
  if (!user) {
    // Redirect to home if not logged in
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 