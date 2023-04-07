import { Suspense, lazy } from "react";
import AuthGuard from "./components/Guards/AuthGuard";
import RoleBaseGuard from "./components/Guards/RoleBaseGuard";

import MainLayout from "./components/MainLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<p>Loading...</p>}>
      <Component {...props} />
    </Suspense>
  );

const Login = Loadable(lazy(() => import("./pages/auth/Login")));
const User = Loadable(lazy(() => import("./pages/dashboard/users/Users")));
const Categories = Loadable(
  lazy(() => import("./pages/dashboard/categories/Categories"))
);
const Meters = Loadable(lazy(() => import("./pages/dashboard/meters/Meters")));

// Error pages
const AuthorizationRequired = Loadable(
  lazy(() => import("./pages/AuthorizationRequired"))
);
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));
const ServerError = Loadable(lazy(() => import("./pages/ServerError")));

const routes = [
  {
    path: "dashboard",
    element: (
      <RoleBaseGuard roles={["user", "reader", "admin"]}>
        <DashboardLayout />
      </RoleBaseGuard>
    ),
    children: [
      { path: "categories", element: <Categories /> },
      { path: "meters", element: <Meters /> },
      { path: "user", element: <User /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard>
            <Login />
          </AuthGuard>
        ),
      },
      {
        path: "401",
        element: <AuthorizationRequired />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "500",
        element: <ServerError />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
