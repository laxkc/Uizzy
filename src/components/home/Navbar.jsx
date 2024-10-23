import React from "react";
import { Link } from "react-scroll";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth(); // Get the user from AuthContext
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDashboardClick = () => {
    navigate("/teacher"); // Redirect to the dashboard
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={() => window.scrollTo(0, 0)} // Change to scroll to top
          >
            Uizzy
          </h1>
          <ul className="hidden md:flex space-x-8 items-center">
            {["Home", "Features", "Testimonials"].map((item) => (
              <li key={item}>
                <Link
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-indigo-600 transition-colors duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}

            {/* Conditionally render Login/Sign Up or Dashboard */}
            {!user ? (
              <li>
                <Link
                  to="login / sign up"
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-indigo-600 transition-colors duration-300"
                >
                  Login / Sign Up
                </Link>
              </li>
            ) : (
              <li>
                <button
                  onClick={handleDashboardClick}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-300"
                >
                  Dashboard
                </button>
              </li>
            )}
          </ul>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-4 px-6">
            <ul className="space-y-4">
              {["Home", "Features", "Testimonials"].map((item) => (
                <li key={item}>
                  <Link
                    to={item.toLowerCase()}
                    smooth={true}
                    duration={500}
                    className="cursor-pointer hover:text-indigo-600 transition-colors duration-300"
                    onClick={toggleMobileMenu}
                  >
                    {item}
                  </Link>
                </li>
              ))}
              {/* Conditionally render Login/Sign Up or Dashboard in mobile menu */}
              {!user ? (
                <li>
                  <Link
                    to="login / sign up"
                    smooth={true}
                    duration={500}
                    className="cursor-pointer hover:text-indigo-600 transition-colors duration-300"
                    onClick={toggleMobileMenu}
                  >
                    Login / Sign Up
                  </Link>
                </li>
              ) : (
                <li>
                  <button
                    onClick={handleDashboardClick}
                    className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700 transition-colors duration-300"
                  >
                    Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;
