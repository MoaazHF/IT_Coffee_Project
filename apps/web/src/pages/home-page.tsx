import { Link } from "react-router-dom";

export const HomePage = () => (
  <section className="hero">
    <div>
      <p className="eyebrow">Daily Grind Coffee</p>
      <h1>Responsive, consistent coffee ordering experience.</h1>
      <p>
        Production-grade frontend and backend with catalog, auth, cart, and checkout flow.
      </p>
      <div className="row gap">
        <Link className="button" to="/shop">
          Browse Shop
        </Link>
        <Link className="button secondary" to="/contact">
          Contact
        </Link>
      </div>
    </div>
  </section>
);
