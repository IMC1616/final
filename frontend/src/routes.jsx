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
const InvoiceOverview = Loadable(
  lazy(() => import("./pages/dashboard/invoices/InvoiceOverview"))
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
      <RoleBaseGuard roles={["customer", "reader", "manifold", "admin"]}>
        <DashboardLayout />
      </RoleBaseGuard>
    ),
    children: [
      { index: true, element: <Overview /> },
      { path: "account", element: <Account /> },
      {
        path: "customers",
        children: [
          {
            index: true,
            element: (
              <RoleBaseGuard roles={["reader", "admin"]}>
                <Customers />
              </RoleBaseGuard>
            ),
          },
          {
            path: ":customerId",
            element: (
              <RoleBaseGuard roles={["reader", "admin"]}>
                <CustomerOverview />
              </RoleBaseGuard>
            ),
          },
        ],
      },
      {
        path: "invoices",
        children: [
          {
            index: true,
            element: (
              <RoleBaseGuard roles={["admin", "manifold"]}>
                <Invoices />
              </RoleBaseGuard>
            ),
          },
          {
            path: ":invoiceId",
            element: (
              <RoleBaseGuard roles={["admin", "manifold"]}>
                <InvoiceOverview />
              </RoleBaseGuard>
            ),
          },
        ],
      },
      {
        path: "categories",
        element: (
          <RoleBaseGuard roles={["admin"]}>
            <Categories />
          </RoleBaseGuard>
        ),
      },
      {
        path: "meters",
        element: (
          <RoleBaseGuard roles={["admin", "reader"]}>
            <Meters />
          </RoleBaseGuard>
        ),
      },
      {
        path: "users",
        element: (
          <RoleBaseGuard roles={["admin"]}>
            <Users />
          </RoleBaseGuard>
        ),
      },
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
