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
const Overview = Loadable(
  lazy(() => import("./pages/dashboard/overview/Overview"))
);
const Account = Loadable(
  lazy(() => import("./pages/dashboard/account/Account"))
);
const Invoices = Loadable(
  lazy(() => import("./pages/dashboard/invoices/Invoices"))
);
const Meters = Loadable(lazy(() => import("./pages/dashboard/meters/Meters")));
const Customers = Loadable(
  lazy(() => import("./pages/dashboard/customers/Customers"))
);
const CustomerOverview = Loadable(
  lazy(() => import("./pages/dashboard/customers/CustomerOverview"))
);
const Categories = Loadable(
  lazy(() => import("./pages/dashboard/categories/Categories"))
);
const Users = Loadable(lazy(() => import("./pages/dashboard/users/Users")));

// Error pages
const AuthorizationRequired = Loadable(
  lazy(() => import("./pages/AuthorizationRequired"))
);
const ServerError = Loadable(lazy(() => import("./pages/ServerError")));
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));

const routes = [
  {
    path: "dashboard",
    element: (
      <RoleBaseGuard roles={["user", "reader", "admin"]}>
        <DashboardLayout />
      </RoleBaseGuard>
    ),
    children: [
      { path: "overview", element: <Overview /> },
      { path: "account", element: <Account /> },
      {
        path: "customers",
        children: [
          {
            index: true,
            element: <Customers />, // TODO: Add guard to this route
          },
          {
            path: ":customerId",
            element: <CustomerOverview />, // TODO: Add guard to this route
          },
        ],
      },
      { path: "invoices", element: <Invoices /> },
      { path: "categories", element: <Categories /> },
      { path: "meters", element: <Meters /> },
      { path: "users", element: <Users /> },
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
