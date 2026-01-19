import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form fields
  const validate = () => {
    const validationErrors = {};
    if (!formData.email) validationErrors.email = "Email is required.";
    if (!formData.password) validationErrors.password = "Password is required.";
    return validationErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("https://errandgirlie-backend.onrender.com/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
                    credentials: "include" // ✅ important if backend uses cookies or sessions
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ general: data.message || "Invalid credentials" });
          setIsSubmitting(false);
          return;
        }

        // ✅ Store user + token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
        // Trigger Navbar updates
        window.dispatchEvent(new Event("storage"));

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        setErrors({ general: "Server error. Try again later." });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 py-8 bg-white rounded-lg shadow-lg mt-12 md:mt-20">
          <h2 className="text-2xl font-extrabold text-center text-Elegant-Gold">
            Welcome Back!
          </h2>
          <p className="text-center text-Brown mt-2">
            Log in to your account to continue
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="block w-full px-3 py-2 border border-green rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full px-3 py-2 border border-green rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* General errors */}
            {errors.general && (
              <p className="text-red-500 text-sm mt-1">{errors.general}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md text-white font-semibold shadow-md ${isSubmitting ? "bg-gray-400" : "bg-Elegant-Gold hover:bg-Brown"
                }`}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Signup link */}
          <div className="text-center mt-6">
            <p className="text-sm text-green-700">
              Don't have an account?{" "}
              <Link
              to="/signup"
                className="text-Elegant-Gold font-bold hover:text-orange-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-orange-500 font-bold py-6 mt-auto w-full text-center">
        <p>&copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
