import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user", 
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!formData.name) validationErrors.name = "Full name is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Please enter a valid email address";
    if (!formData.password) validationErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";
    if (!formData.terms)
      validationErrors.terms = "You must agree to the terms and conditions";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://errandgirlie-backend.onrender.com/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
          credentials: "include" // ✅ important if backend uses cookies or sessions
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (!response.ok) throw new Error(data.message || "Signup failed");

      // Store user data in localStorage
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("User stored in localStorage:", userData);

      setSuccessMessage("Signup successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Signup Error:", error.message);
      setErrors({ apiError: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="max-w-md w-full mx-auto px-4 md:px-6 lg:px-8 bg-gray-50 p-8 mt-12 md:mt-20 rounded-lg shadow-lg">
        <h2 className="text-2xl font-extrabold text-center text-Elegant-Gold">
          Create Your Account
        </h2>

        {errors.apiError && <p className="text-red-500 text-sm text-center">{errors.apiError}</p>}
        {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border rounded-md"
              placeholder="Full Name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border rounded-md"
              placeholder="Email Address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border rounded-md"
              placeholder="Phone Number"
            />
          </div>

          <div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border rounded-md"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border rounded-md"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <input type="hidden" value={formData.role} name="role" />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-Brown font-bold">
              I agree to the terms and conditions
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-Elegant-Gold text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-Brown"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-Elegant-Gold">
            Already have an account?{" "}
            <Link
            to="/login" className="text-Brown hover:text-Elegant-Gold font-bold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;





