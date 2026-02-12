import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const API_URL = "http://localhost:10000/api/contact/send"; // Replace with your backend URL

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Basic validation
  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name || !email || !message) return "All fields are required.";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return "Please enter a valid email address.";
    return null;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSuccessMessage("Your message has been sent successfully 🎉");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-Ivory-White min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-blue-500 to-orange-600 text-Muted-Black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-Elegant-Gold mb-4">Get in Touch</h1>
          <p className="text-lg">We'd love to hear from you! Send us a message and we'll get back to you as soon as possible.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Form */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl text-Elegant-Gold font-semibold mb-6">Send Us a Message</h2>

            {successMessage && (
              <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-Brown font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-Brown font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-Brown font-bold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows="5"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 text-white font-medium rounded-md ${
                  isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-Elegant-Gold hover:bg-Elegant-Gold"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl text-center text-Elegant-Gold font-semibold mb-4">Contact Information</h2>
            <p className="text-lg text-Brown mb-6">Reach out via email or follow us on social platforms.</p>
            <div className="space-y-4">
              <p className="text-Brown"><strong className="text-Elegant-Gold">Email:</strong> luxshoppers247@gmail.com</p>
              <p className="text-Brown"><strong className="text-Elegant-Gold">Address:</strong> Gwarimpa District, Abuja, Nigeria</p>
              <p className="text-Brown"><strong className="text-Elegant-Gold">Opens:</strong> Mon - Fri, 09:00 - 17:00</p>
              <p className="text-Brown">
                <a
                  href="https://wa.me/2348059341247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-700 inline-flex items-center space-x-2"
                >
                  <FaWhatsapp style={{ color: "#25D366" }} />
                  <span>+234 912 557 3651</span>
                </a>
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl text-center text-Elegant-Gold font-semibold mb-6">Follow Us On</h2>
              <div className="flex justify-center space-x-4 text-3xl">
                <a href="https://www.facebook.com/LuxShoppers" target="_blank" rel="noopener noreferrer" className="hover:text-blue-800"><FaFacebook style={{ color: "#1877f2" }} /></a>
                <a href="https://www.instagram.com/luxshoppers247" target="_blank" rel="noopener noreferrer" className="hover:text-pink-700"><FaInstagram style={{ color: "#E4405F" }} /></a>
                <a href="https://www.tiktok.com/@luxshoppers247" target="_blank" rel="noopener noreferrer" className="hover:text-black"><FaTiktok style={{ color: "#000000" }} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>&copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
