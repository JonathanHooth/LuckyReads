import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    window.setTimeout(() => {
      navigate("/home", {
        state: { email },
      });
    }, 450);
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-copy">
          <p className="login-eyebrow">LuckyReads</p>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to continue your reading journey
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

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <div className="login-meta">
            <button className="login-link" type="button">
              Forgot password?
            </button>
          </div>

          {error ? (
            <p className="login-message login-message-error">{error}</p>
          ) : null}

          <button className="login-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-divider" aria-hidden="true">
          <span />
          <p>or</p>
          <span />
        </div>

        <p className="login-footer">
          Don&apos;t have an account yet?{" "}
          <Link className="login-footer-link" to="/home">
            Create Reader Profile
          </Link>
        </p>
      </section>
    </main>
  );
}
