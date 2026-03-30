import { createElement } from "react";
import {
    createBrowserRouter,
    Navigate,
    type RouteObject,
} from "react-router-dom";
import Login from "./pages/Login";
import MyShelf from "./pages/MyShelf";

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
        path: "/myshelf",
        element: createElement(MyShelf),
    },
];

export const router = createBrowserRouter(routes);
