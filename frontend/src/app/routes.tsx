import { createElement, useState, type FormEvent } from "react";
import {
  createBrowserRouter,
  Link,
  Navigate,
  useLocation,
  type RouteObject,
} from "react-router-dom";
import Login from "./pages/login";
import Onboarding from "./pages/onboarding";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter the email connected to your account.");
      setIsSubmitted(false);
      return;
    }

    setError("");
    setIsSubmitted(true);
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-copy">
          <p className="login-eyebrow">LuckyReads</p>
          <h1 className="login-title">Forgot Password?</h1>
          <p className="login-subtitle">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          {error ? (
            <p className="login-message login-message-error">{error}</p>
          ) : null}

          {isSubmitted ? (
            <p className="login-message login-message-success">
              Thanks. We&apos;ve captured your email for the recovery flow, and
              this page is ready to connect to the backend reset feature.
            </p>
          ) : null}

          <button className="login-submit" type="submit">
            Send Reset Link
          </button>
        </form>

        <p className="login-footer login-footer-left">
          <Link className="login-footer-link" to="/login">
            Back to Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}

function ReaderHome() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;
  const onboardingComplete = (
    location.state as { onboardingComplete?: boolean; profileName?: string } | null
  )?.onboardingComplete;
  const profileName = (
    location.state as { onboardingComplete?: boolean; profileName?: string } | null
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
          Home is still a work in progress, so this page is acting as the
          temporary landing spot for now.
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
    element: createElement(Onboarding),
  },
  {
    path: "/home",
    element: createElement(ReaderHome),
  },
];

export const router = createBrowserRouter(routes);
