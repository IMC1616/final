import React from "react";
import { Outlet } from "react-router";
import { styled } from "@mui/system";

const MainLayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100%",
}));

const MainLayout = ({ children }) => (
  <MainLayoutRoot>{children || <Outlet />}</MainLayoutRoot>
);

export default MainLayout;
