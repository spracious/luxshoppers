import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASEURL } from "../constant";
import axios from "axios";

const AgentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const userName = storedUser?.name || "Agent";
  const [activeSection, setActiveSection] = useState("Home");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeMessageTab, setActiveMessageTab] = useState("Unattended");
 const [homeStats, setHomeStats] = useState([]);
const [homeActivities, setHomeActivities] = useState([]);
const [isHomeLoading, setIsHomeLoading] = useState(false);
const [homeError, setHomeError] = useState("");

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedNotification(null);
  };

  const handleLogout = () => navigate("/login");

  const task = [
    { task: "Deliver package to Zone 4", due: "Today" },
    { task: "Pick up documents from Client A", due: "Tomorrow" },
    { task: "Verify shipment at Warehouse", due: "Dec 20" },
  ];

//   const stats = [
//     { title: "Tasks", count: "12", description: "Pending tasks to complete", color: "text-blue-600" },
//     { title: "Orders", count: "8", description: "Ongoing delivery orders", color: "text-green-600" },
//     { title: "Messages", count: "5", description: "Unread notifications", color: "text-red-600" },
//     { title: "Performance", count: "89%", description: "Performance score", color: "text-purple-600" },
//   ];

//   const recentActivities = [
//     { description: "Errand #123 completed", timestamp: "5 mins ago" },
//     { description: "New user registered", timestamp: "15 mins ago" },
//     { description: "Payment received for Order #456", timestamp: "1 hour ago" },
//   ];

useEffect(() => {
  const fetchHomeData = async () => {
    // Only fetch if this section is active
    if (activeSection !== "Home") return;

    setIsHomeLoading(true);
    setHomeError("");

    try {
      // ✅ Replace with your actual backend endpoint
      const response = await axios.get(`${BASEURL}/admin/stats`); 
      const data = response.data; // Assuming backend returns { stats: [], recentActivities: [] }

      // 1. Format Stats Cards (Mapping API data to UI format)
      // We assume your API returns distinct values like totalUsers, revenue, etc.
      // If your API returns an array called 'stats', you can set it directly.
      const formattedStats = [
        {
          title: "Active Errands",
          count: data.stats.find(s => s.label === "Total Errands")?.value || 0,
          color: "text-blue-600",
          description: "Total errands",
        },  
    {
    title: "Errands Completed",
    // ✅ Fix: Use the exact label from backend
    count: data.stats.find(s => s.label === "Errand Completed")?.value || 0, 
    color: "text-green-600",
    description: "Successfully delivered", // Updated description
  },
  {
    title: "Total Earnings",
    // ✅ Fix: Format currency here
    count: `₦${(data.stats.find(s => s.label === "Total Earnings")?.value || 0).toLocaleString()}`, 
    color: "text-blue-600",
    description: "Earnings this month",
  },
        {
          title: "Agent Assignrd Errands",
          count: data.stats.find(s => s.label === "Errand Pending Approvals")?.value || 0,
          color: "text-orange-500",
          description: "Requires attention",
        },
        {
          title: "Total Agents",
          count: data.stats.find(s => s.label === "Registered Agents")?.value || 0,
          color: "text-purple-600",
          description: "Agents",
        }
      ];

      setHomeStats(formattedStats);
      setHomeActivities(data.recentActivities || []);

    } catch (error) {
      console.error("Error fetching home data:", error);
      setHomeError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsHomeLoading(false);
    }
  };

  fetchHomeData();
}, [activeSection]);

  const notifications = [
    { id: 1, title: "New orders are available for review.", sender: "Admin", status: "unattended" },
    { id: 2, title: "Your last task was marked completed.", sender: "System", status: "executed" },
    { id: 3, title: "Team meeting at 3:00 PM.", sender: "Reminder", status: "pending" },
  ];

  const filteredNotifications = notifications.filter(
    (notif) => notif.status === activeMessageTab.toLowerCase()
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-Brown text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-1xl font-bold text-Elegant-Gold">Agent {userName},</h1>
          <p className="text-sm text-Soft-beige mt-1">Welcome back!</p>
        </div>
        <nav className="flex-grow p-4">
          {["Home", "Task", "Orders", "Notifications", "Profile"].map((section) => (
            <button
              key={section}
              onClick={() => handleSectionChange(section)}
              className={`block w-full text-left px-4 py-2 mt-2 rounded-lg ${
                activeSection === section
                    ? "bg-Elegant-Gold text-white"
                    : "hover:bg-Soft-beige hover:text-Elegant-Gold"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-Soft-beige shadow-md">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-Elegant-Gold">{activeSection}</h2>
          <div className="flex items-center space-x-4">
            {/* <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md"
              onClick={() => alert("Viewing all notifications!")}
            >
              View All Notifications
            </button> */}
         <div className="flex items-center space-x-2">
              <span className="text-Brown font-semibold">Hello, {userName}!</span>
              <img
                src={`https://ui-avatars.com/api/?name=${userName}&background=random`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
        </header>

        {/* Sections */}
       {activeSection === "Home" && (
  <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6">
    {/* Page Title */}
    <h3 className="text-xl sm:text-2xl font-bold text-Brown mb-6">Dashboard </h3>

    {/* Error Message */}
    {homeError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
        {homeError}
      </div>
    )}

    {/* Loading State */}
    {isHomeLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <>
        {/* --- Quick Stats Grid --- */}
        {/* Updated: grid-cols-1 for mobile, 2 for tablet, 4 for desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {homeStats.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 sm:p-6 transform transition hover:scale-105 border-l-4 border-transparent hover:border-Elegant-Gold"
            >
              <h4 className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide">
                {card.title}
              </h4>
              <p className={`text-2xl sm:text-3xl font-bold mt-2 ${card.color}`}>
                {card.count}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* --- Recent Activities --- */}
        <h3 className="text-lg sm:text-xl font-bold text-Brown mt-8 mb-4">
          Recent Activities
        </h3>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <ul className="space-y-3">
            {homeActivities.length === 0 ? (
              <li className="text-gray-500 text-center py-4">No recent activities found.</li>
            ) : (
              homeActivities.map((activity, idx) => (
                <li
                  key={idx}
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <p className="text-sm sm:text-base text-gray-800 font-medium">
                    {activity.description}
                  </p>
                  
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleString("en-NG", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    )}
  </section>
)}

        {activeSection === "Task" && (
          <section>
            <h3 className="text-xl font-bold mb-4">Service Summary</h3>
            <ul className="space-y-2">
              {task.map((item, index) => (
                <li key={index} className="py-3 flex justify-between items-center">
                  <span className="text-gray-600">{item.task}</span>
                  <span className="text-sm text-gray-500">{item.due}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

{activeSection === "Orders" && (
  <section>
    <h3 className="text-3xl text-orangee font-bold mb-4">Orders</h3>
    {/* <p className="mb-4 text-gray-600">
      Here, you can manage and track all your current and past orders. Review the status of each order, update their details, and take appropriate actions.
    </p> */}

    {/* <div className="mb-6">
      <button
        onClick={() => alert("Adding a new order...")}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
      >
        Add New Order
      </button>
    </div> */}

<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {[
    { id: 1, customer: "Client A", status: "Pending", deliveryDate: "Dec 20", description: "Documents delivery" },
    { id: 2, customer: "Client B", status: "Delivered", deliveryDate: "Dec 15", description: "Package drop-off" },
    { id: 3, customer: "Client C", status: "In Progress", deliveryDate: "Dec 18", description: "Urgent shipment" },
  ].map((order) => (
    <div
      key={order.id}
      className="p-4 md:p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition"
    >
      <h4 className="text-lg font-bold text-green mb-2">Order #{order.id}</h4>
      <p className="text-gray-600">
        <strong>Customer:</strong> {order.customer}
      </p>
      <p className="text-gray-600">
        <strong>Status:</strong>{" "}
        <span
          className={`${
            order.status === "Delivered"
              ? "text-green"
              : order.status === "Pending"
              ? "text-red-500"
              : "text-yellow-500"
          } font-semibold`}
        >
          {order.status}
        </span>
      </p>
      <p className="text-gray-600">
        <strong>Delivery Date:</strong> {order.deliveryDate}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Description:</strong> {order.description}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => alert(`Viewing details for Order #${order.id}`)}
          className="px-4 py-2 bg-blue text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          View Details
        </button>
        {order.status !== "Delivered" && (
          <button
            onClick={() => alert(`Marking Order #${order.id} as Delivered`)}
            className="px-4 py-2 bg-green text-white rounded-lg shadow-md hover:bg-green-600 transition"
          >
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  ))}
</div>


    <h4 className="text-lg font-bold text-green mt-8 mb-4">Order Summary</h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-blue-100 rounded-lg shadow-md text-center">
        <p className="text-2xl font-bold text-blue-600">8</p>
        <p className="text-gray-600">Total Orders</p>
      </div>
      <div className="p-4 bg-green rounded-lg shadow-md text-center text-blue">
        <p className="text-2xl font-bold text-green-600">3</p>
        <p className="text-blue">Delivered Orders</p>
      </div>
      <div className="p-4 bg-yellow-100 rounded-lg shadow-md text-center">
        <p className="text-2xl font-bold text-yellow-600">2</p>
        <p className="text-gray-600">In Progress</p>
      </div>
      <div className="p-4 bg-red-100 rounded-lg shadow-md text-center">
        <p className="text-2xl font-bold text-red-600">3</p>
        <p className="text-gray-600">Pending Orders</p>
      </div>
    </div>
  </section>
)}


        {activeSection === "Notifications" && (
          <section>
            <h3 className="text-xl font-bold mb-4">Notifications</h3>
            <div className="space-x-2 mb-4">
              {["Unattended", "Pending", "Executed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMessageTab(tab)}
                  className={`px-4 py-2 rounded-lg ${
                    activeMessageTab === tab ? "bg-orange-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {filteredNotifications.map((notif) => (
                <li
                  key={notif.id}
                  className="p-4 bg-white rounded-lg shadow-md"
                  onClick={() => setSelectedNotification(notif)}
                >
                  <h4 className="font-bold">{notif.title}</h4>
                  <p className="text-sm text-gray-500">From: {notif.sender}</p>
                </li>
              ))}
            </ul>
            {selectedNotification && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <h4 className="font-bold">{selectedNotification.title}</h4>
                <p>Details about the notification go here.</p>
              </div>
            )}
          </section>
        )}

        {activeSection === "Profile" && (
          <section>
            <h3 className="text-xl font-bold mb-4">Profile Settings</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your full name"
                  defaultValue={userName}
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  placeholder="Enter a new password"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded shadow-md"
              >
                Save Changes
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default AgentDashboard;




