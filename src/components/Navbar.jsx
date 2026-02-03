import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/luxshopper logo.png";

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

      const response = await fetch(
        `https://errandgirlie-backend.onrender.com/api/v1/users/${storedUser.id}`,
        { credentials: "include" }
      );

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
    <nav className="bg-white shadow-lg p-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="LuxShoppers" className="w-32 mt-4" />
        </Link>

        {/* Center Menu */}
        <div className="hidden md:flex mt-8 space-x-10 items-center">
          <Link
            to="/about"
            className="text-Brown hover:text-Elegant-Gold transition duration-300 font-semibold text-lg"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-Brown hover:text-Elegant-Gold transition duration-300 font-semibold text-lg"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="text-Brown hover:text-Elegant-Gold transition duration-300 font-semibold text-lg"
          >
            Contact
          </Link>
        </div>

        {/* Right Menu */}
        <div className="hidden md:flex mt-8 space-x-4 items-center">
          {user && (
            <Link
              to="/dashboard"
            className="text-Brown hover:text-Elegant-Gold transition duration-300 font-semibold text-lg"
            >
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg transform hover:bg-red-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
            className="bg-Brown text-white py-2 font-bold px-4 rounded-xl shadow-lg transform hover:bg-Elegant-Gold hover:text-Brown transition duration-300"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-Brown focus:outline-none"
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
      <div className={`md:hidden ${menuOpen ? "block" : "hidden"} mt-3 space-y-2 justify-between`}>
        <Link
          to="/about"
          className="block text-Brown hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          About
        </Link>
        <Link
          to="/services"
          className="block text-Brown hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          Services
        </Link>
        <Link
          to="/contact"
          className="block text-Brown hover:text-Elegant-Gold transition duration-300"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>

   <div className="mt-10">
         {user && (
          <Link
            to="/dashboard"
          className="block text-Brown hover:text-Elegant-Gold transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
        )}

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition text-left"
          >
            Logout
          </button>
        ) : (
        <Link
  to="/login"
  className=" mt-10 bg-Brown text-white px-4 py-2 rounded hover:bg-Elegant-Gold transition w-full text-left"
  onClick={() => setMenuOpen(false)}
>
  Sign In
</Link>

        )}
   </div>
      </div>
    </nav>
  );
};

export default Navbar;
