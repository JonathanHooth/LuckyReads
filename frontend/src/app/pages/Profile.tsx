import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { fetchCurrentUser, updateCurrentUser } from "../../api/users";
import { getApiErrorMessage } from "../../api/client";
import { getStoredUser, storeSession } from "../session";
import type { AuthUser } from "../../api/auth";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [user, setUser] = useState<AuthUser | null>(storedUser);
  const [name, setName] = useState(storedUser?.name ?? "");
  const [bio, setBio] = useState(storedUser?.bio ?? "");
  const [initialName, setInitialName] = useState(storedUser?.name ?? "");
  const [initialBio, setInitialBio] = useState(storedUser?.bio ?? "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError("");

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        setName(currentUser.name ?? "");
        setBio(currentUser.bio ?? "");
        setInitialName(currentUser.name ?? "");
        setInitialBio(currentUser.bio ?? "");
      } catch (err) {
        setError("Unable to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedInitialName = initialName.trim();
    const trimmedBio = bio.trim();
    const nameChanged = trimmedName !== trimmedInitialName;
    const bioChanged = bio !== initialBio;

    if (!trimmedName) {
      setError("Name cannot be empty.");
      setSuccess("");
      return;
    }

    if (!nameChanged && !bioChanged) {
      setSuccess("No changes to save.");
      setError("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedUser = await updateCurrentUser({
        ...(nameChanged ? { name: trimmedName } : {}),
        ...(bioChanged ? { bio: trimmedBio } : {}),
      });
      setUser(updatedUser);
      storeSession(undefined, updatedUser);
      setName(updatedUser.name ?? trimmedName);
      setBio(updatedUser.bio ?? "");
      setInitialName(updatedUser.name ?? trimmedName);
      setInitialBio(updatedUser.bio ?? "");
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-shell">
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-shell">
        <div className="profile-card">
          <div className="profile-header">
            <div>
              <h1>Your profile</h1>
              <p>Update your reader profile and logout when you are done.</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/home")}
            >
              Back to home
            </button>
          </div>

          {error ? <div className="profile-alert profile-alert--error">{error}</div> : null}
          {success ? <div className="profile-alert profile-alert--success">{success}</div> : null}

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input type="email" value={user?.email ?? ""} disabled />
            </label>

            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your display name"
              />
            </label>

            <label>
              Bio
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Write a short reading bio"
              />
            </label>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
