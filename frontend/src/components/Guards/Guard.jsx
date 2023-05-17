import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const Guard = ({ children, roles }) => {
  const user = useSelector(selectCurrentUser);

  if (!roles) return <>{children}</>;
  const userHasRequiredRole = user && roles.includes(user.role);
  if (!userHasRequiredRole) return null;
  return <>{children}</>;
};

export default Guard;
