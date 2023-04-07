import { useState } from "react";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/system";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const DashboardLayoutWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: "64px",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: "280px",
  },
}));

const DashboardLayoutContainer = styled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const DashboardLayoutContent = styled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
  position: "relative",
  WebkitOverflowScrolling: "touch",
});

const DashboardLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar
        onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)}
      />
      <DashboardSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <Outlet />
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
