import React from 'react';
import { useAuth } from '../hooks/useAuth';
import GamePage from '../pages/GamePage';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Game Route Component
 * Protected route that requires authentication and MFA
 */
const GameRoute = () => {
  const { isAuthenticated, isMFAEnabled, isMFADisabled } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to MFA setup if MFA is disabled
  if (isMFADisabled) {
    return <Navigate to="/mfa-setup" state={{ from: location }} replace />;
  }

  // Redirect to MFA verification if MFA is enabled but not verified
  if (isMFAEnabled && !isMFADisabled) {
    return <Navigate to="/mfa-verify" state={{ from: location }} replace />;
  }

  // Render game page
  return <GamePage />;
};

export default GameRoute;