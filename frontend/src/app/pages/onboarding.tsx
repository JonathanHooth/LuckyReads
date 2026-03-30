import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const highlights = [
  {
    title: "Personalized Recommendations",
    description:
      "Get book suggestions tailored to your unique reading preferences",
  },
  {
    title: "Connect with Book Buddies",
    description:
      "Find readers with similar tastes and share recommendations",
  },
  {
    title: "Track Your Reading",
    description: "Organize your books and set reading goals",
  },
];

const genreOptions = [
  "Fantasy",
  "Romance",
  "Thriller",
  "Historical Fiction",
  "Mystery",
  "Science Fiction",
  "Contemporary",
  "Memoir",
];

const bookOptions = [
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
  },
  {
    title: "Fourth Wing",
    author: "Rebecca Yarros",
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
  },
  {
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
  },
  {
    title: "Beach Read",
    author: "Emily Henry",
  },
];

const goalOptions = [
  "Read more consistently",
  "Find books I will actually finish",
  "Meet readers with similar taste",
  "Build my next TBR list",
];

const totalSteps = 5;

const meetsPasswordRules = (password: string) =>
  password.length >= 8 &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password);

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  const toggleSelection = (
    value: string,
    selections: string[],
    setSelections: (next: string[]) => void,
  ) => {
    if (selections.includes(value)) {
      setSelections(selections.filter((item) => item !== value));
      return;
    }

    setSelections([...selections, value]);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        setError("Enter your email and complete both password fields.");
        return false;
      }

      if (!meetsPasswordRules(password)) {
        setError(
          "Password must be at least 8 characters and include a letter and a number.",
        );
        return false;
      }

      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return false;
      }
    }

    if (step === 4) {
      if (!name.trim() || !bio.trim()) {
        setError("Add your name and a short bio to finish your profile.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    setStep((current) => Math.min(current + 1, totalSteps - 1));
  };

  const previousStep = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  };

  const finishOnboarding = () => {
    if (!validateStep()) {
      return;
    }

    navigate("/home", {
      state: {
        onboardingComplete: true,
        profileName: name,
      },
    });
  };

  return (
    <main className="login-shell">
      <section className="login-panel onboarding-panel">
        <div className="onboarding-progress" aria-label="Onboarding progress">
          {Array.from({ length: totalSteps }, (_, item) => (
            <span
              key={item}
              className={
                item <= step
                  ? "onboarding-progress-dot onboarding-progress-dot-active"
                  : "onboarding-progress-dot"
              }
            />
          ))}
        </div>

        {step === 0 ? (
          <>
            <div className="login-copy">
              <p className="login-eyebrow">LuckyReads</p>
              <h1 className="login-title">Welcome to LuckyReads</h1>
              <p className="login-subtitle">
                Discover your next favorite book through personalized
                recommendations and connect with readers who share your taste.
              </p>
            </div>

            <div className="onboarding-feature-list">
              {highlights.map((item) => (
                <article key={item.title} className="onboarding-feature-card">
                  <h2 className="onboarding-feature-title">{item.title}</h2>
                  <p className="onboarding-feature-copy">{item.description}</p>
                </article>
              ))}
            </div>

            <div className="onboarding-actions">
              <Link className="login-footer-link" to="/login">
                Back to Sign In
              </Link>
              <button className="login-submit" type="button" onClick={nextStep}>
                Get Started
              </button>
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="login-copy">
              <p className="login-eyebrow">Step 2 of 5</p>
              <h1 className="login-title">Create your account</h1>
              <p className="login-subtitle">
                Start with your email and a secure password for your new reader
                profile.
              </p>
            </div>

            <form className="login-form" onSubmit={(event) => event.preventDefault()}>
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
                <span>Create Password</span>
                <input
                  type="password"
                  name="new-password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>

              <label className="login-field">
                <span>Confirm Password</span>
                <input
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>

              <div className="onboarding-summary">
                <p className="onboarding-note">
                  Password requirements: at least 8 characters, one letter, and
                  one number.
                </p>
              </div>
            </form>

            {error ? (
              <p className="login-message login-message-error">{error}</p>
            ) : null}

            <div className="onboarding-actions">
              <button className="onboarding-secondary" type="button" onClick={previousStep}>
                Back
              </button>
              <button className="login-submit" type="button" onClick={nextStep}>
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="login-copy">
              <p className="login-eyebrow">Step 3 of 5</p>
              <h1 className="login-title">Tell us what you like</h1>
              <p className="login-subtitle">
                Choose a few genres and books you already enjoy so we can start
                shaping recommendations.
              </p>
            </div>

            <div className="onboarding-section">
              <h2 className="onboarding-section-title">Favorite genres</h2>
              <div className="onboarding-chip-grid">
                {genreOptions.map((genre) => {
                  const isActive = selectedGenres.includes(genre);

                  return (
                    <button
                      key={genre}
                      type="button"
                      className={
                        isActive
                          ? "onboarding-chip onboarding-chip-active"
                          : "onboarding-chip"
                      }
                      onClick={() =>
                        toggleSelection(
                          genre,
                          selectedGenres,
                          setSelectedGenres,
                        )
                      }
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="onboarding-section">
              <div className="onboarding-section-header">
                <h2 className="onboarding-section-title">
                  Pick a few books you love
                </h2>
                <p className="onboarding-note">
                  Demo catalog for MVP. We can connect real book search later.
                </p>
              </div>

              <div className="onboarding-book-grid">
                {bookOptions.map((book) => {
                  const isActive = selectedBooks.includes(book.title);

                  return (
                    <button
                      key={book.title}
                      type="button"
                      className={
                        isActive
                          ? "onboarding-book-card onboarding-book-card-active"
                          : "onboarding-book-card"
                      }
                      onClick={() =>
                        toggleSelection(
                          book.title,
                          selectedBooks,
                          setSelectedBooks,
                        )
                      }
                    >
                      <span className="onboarding-book-badge">Book Pick</span>
                      <strong>{book.title}</strong>
                      <span>{book.author}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="onboarding-actions">
              <button className="onboarding-secondary" type="button" onClick={previousStep}>
                Back
              </button>
              <button className="login-submit" type="button" onClick={nextStep}>
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="login-copy">
              <p className="login-eyebrow">Step 4 of 5</p>
              <h1 className="login-title">Set your reading vibe</h1>
              <p className="login-subtitle">
                Pick the goal that best matches what you want from LuckyReads
                right now.
              </p>
            </div>

            <div className="onboarding-goal-list">
              {goalOptions.map((goal) => {
                const isActive = selectedGoal === goal;

                return (
                  <button
                    key={goal}
                    type="button"
                    className={
                      isActive
                        ? "onboarding-goal onboarding-goal-active"
                        : "onboarding-goal"
                    }
                    onClick={() => setSelectedGoal(goal)}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>

            <div className="onboarding-actions">
              <button className="onboarding-secondary" type="button" onClick={previousStep}>
                Back
              </button>
              <button className="login-submit" type="button" onClick={nextStep}>
                Continue
              </button>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div className="login-copy">
              <p className="login-eyebrow">Step 5 of 5</p>
              <h1 className="login-title">Create your profile</h1>
              <p className="login-subtitle">
                Finish by telling readers who you are and what kind of books
                you love.
              </p>
            </div>

            <form className="login-form" onSubmit={(event) => event.preventDefault()}>
              <label className="login-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label className="login-field">
                <span>Bio</span>
                <textarea
                  className="login-textarea"
                  name="bio"
                  placeholder="Tell us a little about your reading taste..."
                  rows={5}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                />
              </label>
            </form>

            {error ? (
              <p className="login-message login-message-error">{error}</p>
            ) : null}

            <div className="onboarding-summary">
              <p className="onboarding-note">Email: {email || "Not added yet"}</p>
              <p className="onboarding-note">
                Favorite genres:{" "}
                {selectedGenres.length ? selectedGenres.join(", ") : "None yet"}
              </p>
              <p className="onboarding-note">
                Favorite books:{" "}
                {selectedBooks.length ? selectedBooks.join(", ") : "None yet"}
              </p>
              <p className="onboarding-note">
                Reading goal: {selectedGoal || "None yet"}
              </p>
            </div>

            <div className="onboarding-actions">
              <button className="onboarding-secondary" type="button" onClick={previousStep}>
                Back
              </button>
              <button className="login-submit" type="button" onClick={finishOnboarding}>
                Finish Setup
              </button>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
