import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface NotFoundProps {
  to?: string;
}

const NotFound: FC<NotFoundProps> = ({ to = '/', children = 'Home' }) => (
  <div className="home">
    <h2>Oops! We could not find requested route.</h2>
    <p>
      Use your browser&apos;s back button to navigate to the page you have previously come from, or just press this
      button.
    </p>
    <br />
    <Link to={to} className="btn btn-outline-primary btn-lg">{children}</Link>
  </div>
);

export default NotFound;
