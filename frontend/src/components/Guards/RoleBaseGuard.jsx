import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "../../features/auth/authSlice";
import AuthorizationRequired from "../../pages/AuthorizationRequired";

const RoleBaseGuard = ({ children, roles }) => {
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const hasRole = user && roles.includes(user.role);

  useEffect(() => {
    if (!token && location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }
  }, [location.pathname, requestedLocation, token]);

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (!hasRole) {
    return <AuthorizationRequired />;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default RoleBaseGuard;
