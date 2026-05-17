import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/auth-context";

export const SignupPage = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    try {
      const session = await register(name, email, password);
      setSession(session);
      navigate("/shop");
    } catch {
      setError("Unable to register with current input.");
    }
  };

  return (
    <section className="panel auth-panel">
      <h1>Sign Up</h1>
      <form onSubmit={(event) => void onSubmit(event)}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />
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
          Create account
        </button>
      </form>
      {error ? <p className="error-text">{error}</p> : null}
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};
