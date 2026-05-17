import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/auth-context";

export const LoginPage = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    try {
      const session = await login(email, password);
      setSession(session);
      navigate("/shop");
    } catch {
      setError("Invalid credentials or server unavailable.");
    }
  };

  return (
    <section className="panel auth-panel">
      <h1>Login</h1>
      <form onSubmit={(event) => void onSubmit(event)}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">
          Login
        </button>
      </form>
      {error ? <p className="error-text">{error}</p> : null}
      <p>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </section>
  );
};
