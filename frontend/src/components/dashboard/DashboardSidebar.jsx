import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, Box, Divider, Drawer, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChartSquareBarIcon from "../../icons/ChartSquareBar";
import UsersIcon from "../../icons/Users";
import ManageAccountIcon from "../../icons/ManageAccount";
import CategoryIcon from "../../icons/Category";
import Logo from "../Logo";
import NavSection from "../NavSection";
import Scrollbar from "../Scrollbar";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import Guard from "../Guards/Guard";

const roles = {
  admin: "Administrador",
  reader: "Lector",
  customer: "Socio",
  manifold: "Cobrador",
};

const DashboardSidebar = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const sections = [
    {
      title: "General",
      items: [
        {
          title: "Visión general",
          path: "/dashboard",
          icon: <ChartSquareBarIcon fontSize="small" />,
          roles: ["customer", "reader", "manifold", "admin"],
        },
        // {
        //   title: "Cuenta",
        //   path: "/dashboard/account",
        //   icon: <UserIcon fontSize="small" />,
        // },
      ],
    },
    {
      title: "Administración",
      items: [
        {
          title: "Socios",
          path: "/dashboard/customers",
          icon: <UsersIcon fontSize="small" />,
          roles: ["reader", "admin"],
        },
        {
          title: "Cobranzas",
          path: "/dashboard/invoices",
          icon: <ReceiptLongIcon fontSize="small" />,
          roles: ["manifold", "admin"],
        },
        {
          title: "Categorias",
          path: "/dashboard/categories",
          icon: <CategoryIcon fontSize="small" />,
          roles: ["admin"],
        },
        {
          title: "Reconexiones",
          path: "/dashboard/reconnections",
          icon: <CategoryIcon fontSize="small" />,
          roles: ["admin"],
        },
        {
          title: "Usuarios",
          path: "/dashboard/users",
          icon: <ManageAccountIcon fontSize="small" />,
          roles: ["admin"],
        },
      ],
    },
  ];

  const filterSectionsByRole = (sections, userRole) => {
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.roles.includes(userRole)),
      }))
      .filter((section) => section.items.length > 0);
  };

  const filteredSections = filterSectionsByRole(sections, user.role);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: "none",
              xs: "flex",
            },
            justifyContent: "center",
            p: 2,
          }}
        >
          <RouterLink to="/">
            <Logo
              sx={{
                height: 40,
                width: 40,
              }}
            />
          </RouterLink>
        </Box>
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "background.default",
              borderRadius: 1,
              display: "flex",
              overflow: "hidden",
              p: 2,
            }}
          >
            <RouterLink to="/dashboard/account">
              <Avatar
                src={user.avatar}
                sx={{
                  cursor: "pointer",
                  height: 48,
                  width: 48,
                }}
              />
            </RouterLink>
            <Box sx={{ ml: 2 }}>
              <Typography color="textPrimary" variant="subtitle2">
                {user.name} {user.lastName}
              </Typography>
              <Typography color="textSecondary" variant="body2">
                {roles[user.role]}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {filteredSections.map((section, index) => (
            <NavSection
              key={index}
              pathname={location.pathname}
              isPathActive={isPathActive}
              sx={{
                "& + &": {
                  mt: 3,
                },
              }}
              {...section}
            />
          ))}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            height: "calc(100% - 64px) !important",
            top: "64px !Important",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          width: 280,
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default DashboardSidebar;
