import { createElement } from "react";
import {
    createBrowserRouter,
    Navigate,
    type RouteObject,
} from "react-router-dom";
import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import MyShelf from "./pages/MyShelf";
import Home from "./pages/Home";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: createElement(Navigate, { to: "/login", replace: true }),
    },
    {
        path: "/login",
        element: createElement(Login),
    },
    {
        path: "/forgot-password",
        element: createElement(ForgotPassword),
    },
    {
        path: "/onboarding",
        element: createElement(Navigate, { to: "/signup", replace: true }),
    },
    {
        path: "/signup",
        element: createElement(Onboarding),
    },
    {
        path: "/home",
        element: createElement(Home),
    },
    {
        path: "/my-shelf",
        element: createElement(MyShelf),
    },
];

export const router = createBrowserRouter(routes);
