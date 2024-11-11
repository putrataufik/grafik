import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Main</Link> 
        </li>
        <li>
          <Link to="/second">Second</Link> 
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
