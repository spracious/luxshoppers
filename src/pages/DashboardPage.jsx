import React from "react";
import { useNavigate } from "react-router-dom";

const isWithinOperationalHours = () => {
  const currentHour = new Date().getHours();
  return currentHour >= 10 && currentHour < 15; 
};

const DashboardPage = () => {
  const navigate = useNavigate();

  // Retrieve the user from localStorage
  const storedUser = localStorage.getItem("currentUser");
  const userName = storedUser ? JSON.parse(storedUser).name : "Valued Customer";

  const canPlaceOrder = isWithinOperationalHours();

  return (
    <div className="max-w-4xl mx-auto mt-12 min-h-screen bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold text-Brown mb-10">
        Welcome to Your Dashboard,{" "}
        <span className="text-Elegant-Gold font-bold">{userName}!</span>
      </h1>

      {!canPlaceOrder && (
        <div className="bg-red-200 text-red-800 p-4 rounded-md mb-4">
          <p>
            <strong>Important:</strong> For a top-notch, first-class service,
            LuxShoppers accepts orders only between{" "}
            <span className="font-bold">8:00 AM and 3:00 PM</span>. You can browse
            services and plan your orders for operational hours.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-md shadow">
          <h2 className="font-bold text-lg text-Elegant-Gold mb-5">Start a New Errand</h2>
          <p className="text-Brown">Quickly place a new order.</p>
          <button
            className="mt-3 bg-blue-600 text-Elegant-Gold px-4 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => navigate("/home")}
          >
            Services
          </button>
        </div>

        <div className="bg-green-50 p-4 rounded-md shadow">
          <h2 className="font-bold text-lg text-Elegant-Gold mb-5">Track Your Errands</h2>
          <p className="text-Brown">See your pending and completed tasks.</p>
          <button
            className="mt-3 bg-green-600 text-Elegant-Gold px-4 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => navigate("/errands")}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
















