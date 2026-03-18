import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

// Base API url (can be configured in .env as VITE_API_URL)
const isProduction = import.meta.env.VITE_ENV === 'production';
const API_URL = (isProduction ? import.meta.env.VITE_API_URL_PRO : import.meta.env.VITE_API_URL)
  || "http://localhost:5000";

// DEV-only credentials (set in .env.local as VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD)
// Fall back to the old VITE_ADMIN_EMAIL env var if username isn't provided to avoid breaking older setups.
const DEV_ADMIN_USERNAME = import.meta.env.DEV
  ? import.meta.env.VITE_ADMIN_USERNAME ?? import.meta.env.VITE_ADMIN_EMAIL ?? ""
  : "";
const DEV_ADMIN_PASSWORD = import.meta.env.DEV ? import.meta.env.VITE_ADMIN_PASSWORD ?? "" : "";

/*
  NOTES / SUGGESTED IMPROVEMENTS (developer comments only):

  - Do not hardcode or display default credentials in production UI. Use
    `import.meta.env.DEV` to show any test credentials only during development.

  - Storing tokens in localStorage is convenient for development but exposes
    the token to XSS. For production consider using httpOnly, Secure cookies
    set by the server, or at minimum shorten token lifetime and use refresh
    tokens stored more securely.

  - Validate the email/password client-side for better UX (length, format)
    before sending to server to reduce unnecessary network calls.

  - Improve error messages shown to the user. Currently you set `error` to
    err.message. Map common HTTP statuses (401, 422, 500) to friendly strings.

  - Add rate-limiting and failed-attempt handling on the server side. You can
    add a lightweight client-side throttle (e.g. short cooldown after N
    attempts) for extra protection during development, but don't rely on it
    for security.

  - During login, disable the entire form while `loading` is true (not only the
    submit button) to prevent duplicate submissions.

  - Consider moving fetch logic into a shared API client module
    (`src/api/clients.jsx`) so that base URL, headers (authorization), and
    error parsing are consistent across the app. This also simplifies tests.

  - When redirecting to the dashboard, verify token integrity / expiry on the
    server and handle 401 responses by clearing stored credentials and
    redirecting back to the login page with an explanatory message.

  - Remove or gate the "default credentials for testing" block so it does not
    leak into any deployed site or screenshots.

*/
export default function Admin() {
  // prefill with dev creds when running in development for convenience
  const [username, setUsername] = useState(DEV_ADMIN_USERNAME || "");
  const [password, setPassword] = useState(DEV_ADMIN_PASSWORD || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // If the server is unreachable fetch will throw; handle both network and non-2xx responses
      let data = null;
      try {
        data = await response.json();
      } catch {
        // no JSON body
        data = null;
      }

      if (!response.ok) {
        // Provide clearer messages for common statuses
        const msg = (data && (data.message || data.error)) || `Login failed (${response.status})`;
        // Friendly 401 message
        if (response.status === 401) throw new Error('Invalid username or password');
        throw new Error(msg);
      }

      // Store token (existing flow)
      if (data && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUsername", data.username || username);

        // Redirect to dashboard
        navigate("/admin-dashboard");
        return;
      }

      // If server responded OK but no token was returned, treat as failure
      throw new Error("Login succeeded but server did not return a token");
    } catch (err) {
      // Show friendly error messages on failure
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>TORNADO Admin</h1>
          <p>Content Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary admin-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <div className="admin-error">{error}</div>}

        {import.meta.env.DEV && (
          <div className="admin-login-footer">
            <p>Default credentials for testing (DEV only):</p>
            <p>Username: <code>{DEV_ADMIN_USERNAME || "admin1"}</code></p>
            <p>Password: <code>{DEV_ADMIN_PASSWORD ? "••••••••" : "admin123"}</code></p>
            <small style={{ color: '#666' }}>These values come from your local env (VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD) when available.</small>
          </div>
        )}
      </div>
    </div>
  );
}