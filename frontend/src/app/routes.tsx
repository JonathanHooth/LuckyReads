import { createElement, useState, type FormEvent } from "react";
import {
    createBrowserRouter,
    Navigate,
    useLocation,
    type RouteObject,
} from "react-router-dom";
import ForgotPassword from "./pages/forgot-password";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";
import MyShelf from "./pages/MyShelf";

function ReaderHome() {
    const location = useLocation();
    const email = (location.state as { email?: string } | null)?.email;
    const onboardingComplete = (
        location.state as {
            onboardingComplete?: boolean;
            profileName?: string;
        } | null
    )?.onboardingComplete;
    const profileName = (
        location.state as {
            onboardingComplete?: boolean;
            profileName?: string;
        } | null
    )?.profileName;

    return (
        <main className="login-shell">
            <section className="login-panel login-panel-success">
                <p className="login-eyebrow">LuckyReads</p>
                <h1 className="login-title">You&apos;re In</h1>
                <p className="login-subtitle">
                    {profileName
                        ? `Welcome, ${profileName}.`
                        : email
                          ? `Signed in as ${email}.`
                          : onboardingComplete
                            ? "Your reader profile is all set."
                            : "Your sign-in was successful."}{" "}
                    Home is still a work in progress, so this page is acting as
                    the temporary landing spot for now.
                </p>
            </section>
        </main>
    );
}

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
        element: createElement(ReaderHome),
    },
    {
        path: "/my-shelf",
        element: createElement(MyShelf),
    },
];

export const router = createBrowserRouter(routes);
