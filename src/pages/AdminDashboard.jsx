import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("Overview");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeMessageTab, setActiveMessageTab] = useState("Unattended");
  const [agents, setAgents] = useState([]);
const storedUser = JSON.parse(localStorage.getItem("currentUser"));
const userName = storedUser?.name || "Admin";



  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedNotification(null);
  };

    const [formData, setFormData] = useState({
      username: "",
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      vehicleType: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    });
  
    // Function to generate a strong random password
    const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      return Array(10)
        .fill("")
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
    };
  
    // Handle input changes & auto-generate username and password
    const handleChange = (event) => {
      const { name, value } = event.target;
  
      setFormData((prevData) => {
        let updatedData = { ...prevData, [name]: value };
  
        // Auto-generate username and password when full name is entered
        if (name === "fullName") {
          const randomNum = Math.floor(Math.random() * 900) + 100;
          updatedData.username = `Agent${randomNum}`;
          updatedData.password = generatePassword(); // Generate password
          updatedData.confirmPassword = updatedData.password; // Autofill confirm password
        }
  
        return updatedData;
      });
    };
  
    // Handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("Form submitted:", formData);
    };

    const handleDelete = (index) => {
  const updatedAgents = agents.filter((_, i) => i !== index);
  setAgents(updatedAgents);
};



  const handleLogout = () => navigate("/login");

  const services = [
    { name: "Groceries", completed: 15, ongoing: 5, pending: 2 },
    { name: "Deliveries", completed: 10, ongoing: 2, pending: 1 },
    { name: "Errands", completed: 20, ongoing: 3, pending: 0 },
  ];

  const stats = [
    { label: "Total Services Completed", value: 45 },
    { label: "Active Errands", value: 10 },
    { label: "Pending Approvals", value: 3 },
    { label: "Registered Users", value: 33 },
    { label: "Registered Agents", value: 15 },
    { label: "New Messages", value: 3 },
    { label: "Revenue This Month", value: "₦2,300" },
  ];

  const recentActivities = [
    { description: "Errand #123 completed", timestamp: "5 mins ago" },
    { description: "New user registered", timestamp: "15 mins ago" },
    { description: "Payment received for Order #456", timestamp: "1 hour ago" },
  ];

  const notifications = [
    { id: 1, title: "Message 1", timestamp: "10 mins ago", details: "Details for Message 1", status: "unattended" },
    { id: 2, title: "Message 2", timestamp: "30 mins ago", details: "Details for Message 2", status: "pending" },
    { id: 3, title: "Message 3", timestamp: "1 hour ago", details: "Details for Message 3", status: "executed" },
    { id: 4, title: "Message 4", timestamp: "2 hours ago", details: "Details for Message 4", status: "unattended" },
    { id: 5, title: "Message 5", timestamp: "5 hours ago", details: "Details for Message 5", status: "pending" },
  ];

  const filteredNotifications = notifications.filter(
    (notif) => notif.status === activeMessageTab.toLowerCase()
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-Brown text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-1xl font-bold text-Elegant-Gold">Admin {userName},</h1>
          <p className="text-sm text-Soft-beige mt-1">Welcome back!</p>
        </div>
        <nav className="flex-grow p-4">
          {["Overview", "Create Agent", "Agents", "Services", "Errands", "Reports", "Settings"].map(
            (section) => (
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
            )
          )}
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

      <main className="flex-grow p-8 bg-Soft-beige shadow-md">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-Elegant-Gold">{activeSection}</h2>
          <div className="flex items-center space-x-4">
            {/* <button
              className="bg-orange-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
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

        {activeSection === "Overview" && (
          <section>
            <h3 className="text-lg font-bold text-Brown mb-4">
              Quick Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h4 className="text-sm text-Elegant-Gold font-bold">{stat.label}</h4>
                  <p className="text-2xl font-bold text-Brown mt-2">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold text-Brown mt-8 mb-4">
              Recent Activities
            </h3>
            <ul className="bg-gray-200 p-4 rounded-lg shadow-md">
              {recentActivities.map((activity, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <span className="text-Elegant-Gold">{activity.description}</span>
                  <span className="text-sm text-Elegant-Gold">
                    {activity.timestamp}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

{activeSection === "Create Agent" && formData && (
  <section className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
    Agent Registration
  </h2>
  <form onSubmit={handleSubmit}>
    {/* Username (Auto-generated) */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Username</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        readOnly
        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
      />
    </div>

    {/* Full Name */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Full Name</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />
    </div>

    {/* Phone Number */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />
    </div>

    {/* Email */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />
    </div>

    {/* Password (Auto-generated) */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="text"
        name="password"
        value={formData.password}
        readOnly
        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
      />
    </div>

    {/* Confirm Password (Auto-filled) */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
      <input
        type="text"
        name="confirmPassword"
        value={formData.confirmPassword}
        readOnly
        className="w-full p-3 border border-gray-300 rounded bg-gray-100"
      />
    </div>

    {/* Residential Address */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Residential Address</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />
    </div>

    {/* Vehicle Type */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
      <select
        name="vehicleType"
        value={formData.vehicleType}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      >
        <option value="">Select vehicle type</option>
        <option value="Bike">Bike</option>
        <option value="Car">Car</option>
        {/* <option value="Other">Other</option> */}
      </select>
    </div>

    {/* Emergency Contact Name */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
      <input
        type="text"
        name="emergencyContactName"
        value={formData.emergencyContactName}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />
    </div>

    {/* Emergency Contact Phone */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
      <input
        type="tel"
        name="emergencyContactPhone"
        value={formData.emergencyContactPhone}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />
    </div>

    {/* Submit Button */}
    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 mt-4">
      Submit
    </button>
  </form>
</section>
)}

{activeSection === "Agents" && (
        //   <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        //   <h2 className="text-3xl font-bold text-orangee mb-6 text-center">
        //     Registered Agents
        //   </h2>
      
        //   {!agents || agents.length === 0 ? (
        //     <p className="text-center text-gray-600">No agents registered yet.</p>
        //   ) : (
        //     <div className="overflow-x-auto">
        //       <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        //         <thead>
        //           <tr className="bg-gray-200 text-gray-700">
        //             <th className="py-2 px-4 border">Username</th>
        //             <th className="py-2 px-4 border">Full Name</th>
        //             <th className="py-2 px-4 border">Phone</th>
        //             <th className="py-2 px-4 border">Email</th>
        //             <th className="py-2 px-4 border">Vehicle</th>
        //             <th className="py-2 px-4 border">Action</th>
        //           </tr>
        //         </thead>
        //         <tbody>
        //           {agents.map((agent, index) => (
        //             <tr key={index} className="border text-center">
        //               <td className="py-2 px-4">{agent.username}</td>
        //               <td className="py-2 px-4">{agent.fullName}</td>
        //               <td className="py-2 px-4">{agent.phoneNumber}</td>
        //               <td className="py-2 px-4">{agent.email}</td>
        //               <td className="py-2 px-4">{agent.vehicleType}</td>
        //               <td className="py-2 px-4">
        //                 <button
        //                   onClick={() => handleDelete(index)}
        //                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        //                 >
        //                   Delete
        //                 </button>
        //               </td>
        //             </tr>
        //           ))}
        //         </tbody>
        //       </table>
        //     </div>
        //   )}
        // </section>

      <section className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
  <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 text-center">
    Registered Agents
  </h2>

  <div className="overflow-hidden">
    <table className="w-60 bg-white border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-gray-200 text-gray-700 text-sm md:text-base">
          <th className="py-2 px-3 md:px-4 border">Username</th>
          <th className="py-2 px-3 md:px-4 border">Full Name</th>
          <th className="py-2 px-3 md:px-4 border whitespace-nowrap">Phone</th>
          <th className="py-2 px-3 md:px-4 border">Email</th>
          <th className="py-2 px-3 md:px-4 border">Vehicle</th>
          <th className="py-2 px-3 md:px-4 border">Action</th>
        </tr>
      </thead>
      <tbody>
        {[
          {
            username: "Agent001",
            fullName: "John Doe",
            phoneNumber: "+2348123456789",
            email: "john@example.com",
            vehicleType: "Bike",
          },
          {
            username: "Agent002",
            fullName: "Jane Smith",
            phoneNumber: "+2348034567890",
            email: "jane@example.com",
            vehicleType: "Car",
          },
          {
            username: "Agent003",
            fullName: "Michael Johnson",
            phoneNumber: "+2349075678901",
            email: "michael@example.com",
            vehicleType: "Other",
          },
        ].map((agent, index) => (
          <tr key={index} className="border text-center text-sm">
            <td className="py-2 px-3 md:px-4">{agent.username}</td>
            <td className="py-2 px-3 md:px-4">{agent.fullName}</td>
            <td className="py-2 px-3 md:px-4">{agent.phoneNumber}</td>
            <td className="py-2 px-3 md:px-4">{agent.email}</td>
            <td className="py-2 px-3 md:px-4">{agent.vehicleType}</td>
            <td className="py-2 px-3 md:px-4">
              <div className="flex justify-center space-x-2">
                <button className="bg-gray-500 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-gray-700 transition text-xs md:text-sm">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-red-600 transition text-xs md:text-sm">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</section>
        
        )}

        {activeSection === "Services" && (
          <section>
            <h3 className="text-lg font-bold text-orange-400 mb-4">
              Service Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold text-orange-400">
                    {service.name}
                  </h4>
                  <p className="text-sm mt-2">
                    Completed:{" "}
                    <span className="font-bold text-orange-500">
                      {service.completed}
                    </span>
                  </p>
                  <p className="text-sm">
                    Ongoing:{" "}
                    <span className="font-bold text-blue-500">
                      {service.ongoing}
                    </span>
                  </p>
                  <p className="text-sm">
                    Pending:{" "}
                    <span className="font-bold text-green-500">
                      {service.pending}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "Errands" && (
          <section>
            <h3 className="text-lg font-bold text-orangee mb-4">
              Your Errands
            </h3>

            {!selectedNotification ? (
              
              <>
                <div className="flex space-x-4 mb-4">
                  {["Unattended", "Pending", "Executed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveMessageTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        activeMessageTab === tab
                          ? "bg-orangee text-white"
                          : "bg-green text-white hover:bg-orange-300"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {filteredNotifications.length > 0 ? (
                  <ul className="bg-gray-100 p-4 rounded-lg shadow-md">
                    {filteredNotifications.map((notif) => (
                      <li
                        key={notif.id}
                        onClick={() => setSelectedNotification(notif)} 
                        className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-200 px-2 rounded-md"
                      >
                        <span className="text-gray-700">{notif.title}</span>
                        <span className="text-sm text-gray-500">
                          {notif.timestamp}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-orangee">
                    No {activeMessageTab.toLowerCase()} messages.
                  </p>
                )}
              </>
            ) : (
              <div className="bg-gray-200 p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-green mb-4">
                  {selectedNotification.title}
                </h4>
                <p className="text-sm text-orangee mb-2">
                  {selectedNotification.timestamp}
                </p>
                <p className="text-green mb-4">
                  {selectedNotification.details}
                </p>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-orangee px-4 py-2 rounded-lg"
                  onClick={() => setSelectedNotification(null)} 
                >
                  Back to Messages
                </button>
              </div>
            )}
          </section>
        )}

{activeSection === "Reports" && (
  <section className="p-6 bg-gray-50 rounded-lg shadow-md">
    <header className="mb-6">
      <h3 className="text-2xl font-extrabold text-orangee mb-2">
        Reports
      </h3>
      <p className="text-sm text-gray-600">
        Analyze and generate detailed reports to gain insights into your business performance.
      </p>
    </header>

    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-green">Filters</h4>
        <button className="text-blue-500 text-green text-sm hover:underline">
          Reset Filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select...</option>
            <option value="sales">Agents</option>
            <option value="inventory">Users</option>
            <option value="performance">Errands</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              className="w-1/2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              className="w-1/2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button className="px-6 py-2 bg-blue text-white rounded-lg shadow-md hover:bg-blue-700">
          Apply Filters
        </button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-green">Generated Reports</h4>
        <button className="px-4 py-2 bg-green text-white rounded-lg shadow-md hover:bg-green-700">
          Generate New Report
        </button>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 font-semibold text-green border-b border-gray-200">
                Report Name
              </th>
              <th className="text-left px-4 py-2 font-semibold text-green border-b border-gray-200">
                Type
              </th>
              <th className="text-left px-4 py-2 font-semibold text-green border-b border-gray-200">
                Date Generated
              </th>
              <th className="text-left px-4 py-2 font-semibold text-green border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>

            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                Monthly Sales Report
              </td>
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                Sales
              </td>
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                Dec 2024
              </td>
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                <button className="text-blue-600 hover:underline">
                  View
                </button>{" "}
                |{" "}
                <button className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                Yearly Inventory Report
              </td>
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                Inventory
              </td>
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                Dec 2024
              </td>
              <td className="px-4 py-2 text-gray-700 border-b border-gray-200">
                <button className="text-blue-600 hover:underline">
                  View
                </button>{" "}
                |{" "}
                <button className="text-red-600 hover:underline">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-8">
      <h4 className="text-lg font-bold text-green mb-4">
        Analytics Overview
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h5 className="text-sm text-gray-600">Total Reports</h5>
          <p className="text-2xl font-bold text-gray-800">45</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h5 className="text-sm text-gray-600">Reports Generated This Month</h5>
          <p className="text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h5 className="text-sm text-gray-600">Pending Reports</h5>
          <p className="text-2xl font-bold text-gray-800">3</p>
        </div>
      </div>
    </div>
  </section>
)}



{activeSection === "Settings" && (
  <section className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-2xl font-bold text-orangee mb-6">
      Settings
    </h3>
    <p className="text-gray-500 mb-8">
      Manage your profile, preferences, security, and notifications.
    </p>

    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Profile Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-600">Full Name</span>
            <input 
              type="text" 
              className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-orangee focus:ring focus:ring-orangee focus:ring-opacity-50"
              placeholder="John Doe"
            />
          </label>
          <label className="block">
            <span className="text-gray-600">Email Address</span>
            <input 
              type="email" 
              className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-orangee focus:ring focus:ring-orangee focus:ring-opacity-50"
              placeholder="example@email.com"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-gray-600">Bio</span>
            <textarea
              rows="3"
              className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-orangee focus:ring focus:ring-orangee focus:ring-opacity-50"
              placeholder="Tell us a bit about yourself..."
            />
          </label>
        </div>
      </div>

      {/* Preferences */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Preferences
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Enable Dark Mode</span>
            <button 
              className="w-12 h-6 bg-gray-300 rounded-full relative focus:outline-none focus:ring focus:ring-orangee focus:ring-opacity-50">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform transform translate-x-0 peer-checked:translate-x-6"></span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email Notifications</span>
            <button 
              className="w-12 h-6 bg-gray-300 rounded-full relative focus:outline-none focus:ring focus:ring-orangee focus:ring-opacity-50">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform transform translate-x-0 peer-checked:translate-x-6"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Security Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-gray-600">New Password</span>
            <input 
              type="password" 
              className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-orangee focus:ring focus:ring-orangee focus:ring-opacity-50"
              placeholder="Enter new password"
            />
          </label>
          <label className="block">
            <span className="text-gray-600">Confirm Password</span>
            <input 
              type="password" 
              className="block w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-orangee focus:ring focus:ring-orangee focus:ring-opacity-50"
              placeholder="Confirm new password"
            />
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">
          Notifications
        </h4>
        <div className="space-y-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox text-orangee border-gray-300 rounded focus:ring focus:ring-orangee focus:ring-opacity-50"
            />
            <span className="ml-2 text-gray-600">Receive product updates</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox text-orangee border-gray-300 rounded focus:ring focus:ring-orangee focus:ring-opacity-50"
            />
            <span className="ml-2 text-gray-600">Promotional offers</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          className="bg-orangee text-white px-6 py-3 rounded-md shadow hover:bg-orange-600 transition focus:outline-none focus:ring focus:ring-orangee focus:ring-opacity-50">
          Save Changes
        </button>
      </div>
    </div>
  </section>
)}


      </main>
    </div>
  );
};

export default AdminDashboard;
















