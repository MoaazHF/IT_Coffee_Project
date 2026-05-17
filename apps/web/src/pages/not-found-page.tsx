import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <section className="panel">
    <h1>Page not found</h1>
    <Link className="button" to="/">
      Return home
    </Link>
  </section>
);
