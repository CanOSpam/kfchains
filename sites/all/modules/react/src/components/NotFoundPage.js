import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <h4>
        404 Page Not Found
      </h4>
      <Link to="/"> Please go back to homepage </Link>
    </div>
  );
};

export default NotFoundPage;
