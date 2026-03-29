import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  type RouteObject,
} from "react-router-dom";
import Login from "./pages/login";

function ReaderHome() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  return (
    <main className="login-shell">
      <section className="login-panel login-panel-success">
        <p className="login-eyebrow">LuckyReads</p>
        <h1 className="login-title">You&apos;re In</h1>
        <p className="login-subtitle">
          {email
            ? `Signed in as ${email}.`
            : "Your sign-in was successful."}{" "}
          Home and onboarding are still a work in progress, so this page is
          acting as the temporary landing spot for now.
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
    path: "/home",
    element: createElement(ReaderHome),
  },
];

export const router = createBrowserRouter(routes);
