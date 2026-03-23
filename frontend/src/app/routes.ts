import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import Login from "./pages/Login";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: createElement(Navigate, { to: "/login", replace: true }),
  },
  {
    path: "/login",
    element: createElement(Login),
  },
];

export const router = createBrowserRouter(routes);
