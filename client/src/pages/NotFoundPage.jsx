import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="container page empty">
      <Helmet>
        <title>Page not found — Hotels</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1>404</h1>
      <p className="page-sub">That page does not exist. The hotels are all still here, though.</p>
      <Link to="/" className="btn btn--primary">
        Go to the hotel list
      </Link>
    </div>
  );
}
