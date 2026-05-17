import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            Daily Grind
          </Link>
          <nav aria-label="Main navigation" className="main-nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/cart">Cart</NavLink>
            {session ? (
              <button className="link-button" onClick={() => void logout()}>
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container content" id="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} Daily Grind Coffee</div>
      </footer>
    </div>
  );
};
