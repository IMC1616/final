import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { selectCurrentToken } from '../../features/auth/authSlice';

const AuthGuard = ({ children }) => {
    const token = useSelector(selectCurrentToken);

  if (token) {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

export default AuthGuard
