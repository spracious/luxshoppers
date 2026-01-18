import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/luxshopper logo.png";
import { FaSignInAlt } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const navigate = useNavigate();

  // Check authenticated user
  const checkAuth = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!storedUser) {
        setUser(null);
        return;
      }

      const response = await fetch(`/api/v1/users/${storedUser.id}`);
      if (!response.ok) throw new Error("User not authenticated");

      const userData = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("currentUser");
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <nav className="p-3 pe-2 ps-2 h-15 w-full shadow-2xl rounded-x2 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" className="w-32 mt-4" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden mt-5 md:flex space-x-6 items-center">
          <Link
            to="/about"
            className="text-Brown font-normal hover:text-Elegant-Gold transition duration-300 text-2xl"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-Brown font-normal hover:text-Elegant-Gold transition duration-300 text-2xl"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-Brown font-normal hover:text-Elegant-Gold transition duration-300 text-2xl"
          >
            Contact
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-Brown font-normal hover:text-orangee transition duration-300 text-2xl"
            >
              LogOut
            </button>
          ) : (
            <Link
              to="/signup"
              className="text-Brown font-normal hover:text-Elegant-Gold transition duration-300 text-2xl"
            >
              {/* <FaSignInAlt className="inline mr-1" />  */}
              SignUp
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-Brown font-bold focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} mt-5 space-y-2`}>
        <Link
          to="/"
          className="block text-Brown font-normal hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/services"
          className="block text-Brown font-normal hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          Services
        </Link>
        <Link
          to="/about"
          className="block text-Brown font-normal hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          to="/contact"
          className="block text-Brown font-normal hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>

        {user ? (
          <button
            onClick={handleLogout}
          className="block text-Brown font-normal hover:text-Elegant-Gold transition duration-300"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="block text-Brown font-normal hover:text-Elegant-Gold transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;







