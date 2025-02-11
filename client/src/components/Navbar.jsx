import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">Blockchain Blog</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="text-white hover:text-gray-400">
              Home
            </Link>
          </li>
          <li>
            <Link to="/map" className="text-white hover:text-gray-400">
              Map
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-white hover:text-gray-400">
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className="text-white hover:text-gray-400">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
