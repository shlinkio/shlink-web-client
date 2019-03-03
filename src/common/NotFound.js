import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="home">
    <h2>Oops! We could not find requested route.</h2>
    <p>
      Use your browser{'\''}s back button to navigate to the page you have previously come from, or just press this button.
    </p>
    <br />
    <Link to="/" className="btn btn-outline-primary btn-lg">Home</Link>
  </div>
);

export default NotFound;
