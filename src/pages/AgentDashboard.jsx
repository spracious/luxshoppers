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
const [selectedActivity, setSelectedActivity] = useState(null);
const [tasks, setTasks] = useState([]); // Array state named 'task' to match your map code
const [isTaskLoading, setIsTaskLoading] = useState(false);
const [selectedErrand, setSelectedErrand] = useState(null);
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedNotification(null);
  };

  const handleLogout = () => navigate("/login");
//home
// Paste this inside your component function, before return
useEffect(() => {
  const fetchHomeData = async () => {
    if (activeSection !== "Home") return;
    setIsHomeLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const agentId = currentUser._id || currentUser.id;

      const response = await axios.get(`${BASEURL}/admin/home-stats?agentId=${agentId}`);
      const data = response.data;

      const formattedStats = [
        {
          title: "My Commission",
          // ✅ Formats the 5% value to Naira (e.g., ₦5,000.00)
          count: `₦${(data.totalCommission || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
          color: "text-green-600",
          description: "Total delivery earnings", // Updated text
        },
        {
          title: "Completed Errands",
          count: data.completedErrands || 0,
          color: "text-blue-600",
          description: "Total deliveries done",
        },
        {
          title: "Active Errands",
          count: data.activeErrands || 0,
          color: "text-purple-600",
          description: "Currently in progress",
        },
        {
          title: "Pending Requests",
          count: data.pendingErrands || 0,
          color: "text-orange-500",
          description: "Awaiting action",
        }
      ];

      setHomeStats(formattedStats);
      setHomeActivities(data.recentActivities || []);

    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsHomeLoading(false);
    }
  };

  fetchHomeData();
}, [activeSection]);

//task
const [taskPage, setTaskPage] = useState(1);
const [taskTotalPages, setTaskTotalPages] = useState(1);

useEffect(() => {
  const fetchTasks = async () => {
    if (activeSection !== "Task") return;

    setIsTaskLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const agentId = currentUser._id || currentUser.id;

      const response = await axios.get(`${BASEURL}/admin/tasks?agentId=${agentId}&page=${taskPage}&limit=10`);
      
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
        setTaskTotalPages(response.data.totalPages);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching errands:", error);
    } finally {
      setIsTaskLoading(false);
    }
  };

  fetchTasks();
}, [activeSection, taskPage]);


  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-Brown text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-1xl font-bold text-Elegant-Gold">Agent {userName},</h1>
          <p className="text-sm text-Soft-beige mt-1">Welcome back!</p>
        </div>
        <nav className="flex-grow p-4">
          {["Home", "Task"].map((section) => (
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
    <h3 className="text-xl sm:text-2xl font-bold text-Brown mb-6">Dashboard</h3>

    {homeError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
        {homeError}
      </div>
    )}

    {isHomeLoading ? (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <>
        {/* --- Quick Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {homeStats.map((card, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 sm:p-6 transform transition hover:scale-105 border-l-4 border-transparent hover:border-Brown"
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

        {/* --- Recent Activities (Clickable List) --- */}
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
                  // ✅ CLICK ACTION: Opens the modal
                  onClick={() => setSelectedActivity(activity)}
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition duration-200"
                >
                  <div className="flex flex-col">
                    <p className="text-sm sm:text-base text-gray-800 font-medium hover:text-blue-600 transition">
                      {activity.summary || activity.description}
                    </p>
                    {/* Mobile Timestamp */}
                    <span className="text-xs text-gray-500 mt-1 block sm:hidden">
                       {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Desktop Timestamp */}
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap hidden sm:block">
                    {new Date(activity.timestamp).toLocaleString("en-NG", {
                      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* ✅ ACTIVITY DETAILS MODAL */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="bg-Brown px-6 py-4 flex justify-between items-center shrink-0">
                <h3 className="text-white text-lg font-bold">Activity Details</h3>
                <button 
                  onClick={() => setSelectedActivity(null)}
                  className="text-white hover:text-gray-200 font-bold text-xl"
                >
                  &times;
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  
                  {/* Service & Status */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Service Type</p>
                      <p className="text-xl font-bold text-Brown">{selectedActivity.service}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedActivity.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                      selectedActivity.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                      selectedActivity.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedActivity.status}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Description</p>
                    <div className="bg-gray-50 p-3 rounded text-gray-700 text-sm leading-relaxed">
                      {selectedActivity.description}
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Client Name</p>
                      <p className="text-sm font-medium">{selectedActivity.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                      <a href={`tel:${selectedActivity.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {selectedActivity.phone}
                      </a>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Delivery Address</p>
                    <p className="text-sm text-gray-700">{selectedActivity.address}</p>
                    {selectedActivity.location && (
                       <p className="text-xs text-gray-500 mt-1">Area: {selectedActivity.location}</p>
                    )}
                  </div>

                  {/* Financials Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-orange-50 p-3 rounded border border-orange-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Cost</p>
                      <p className="text-lg font-bold text-green-700">
                        ₦{(selectedActivity.estimatedCost || 0).toLocaleString()}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Delivery</p>
                      <p className="text-xs font-mono text-gray-600 break-all">
                        {selectedActivity.DELIVERY_CHARGES || "N/A"}
                      </p>
                    </div> */}
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t">
                    <span>Created: {new Date(selectedActivity.createdAt).toLocaleDateString()}</span>
                    <span>Due: <span className="text-red-500 font-bold">{new Date(selectedActivity.dueDate).toLocaleDateString()}</span></span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium text-sm transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </>
    )}
  </section>
)}

{activeSection === "Task" && (
  <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pb-8">
    <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-Brown px-1">
      Active Errand List
    </h3>

    {isTaskLoading ? (
      <div className="flex justify-center py-12">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : !tasks || tasks.length === 0 ? (
      <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mx-2">
        <p className="text-gray-500 text-base sm:text-lg">No active errands found.</p>
      </div>
    ) : (
      <>
        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-md text-left border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left">
                <tr>
                  {/* ... Existing Headers ... */}
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Client</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Service</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">Description</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">Address</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white text-left divide-y divide-gray-200">
                {tasks.map((task) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const taskDate = task.dueDate ? new Date(task.dueDate) : null;
                  const isOverdue = taskDate ? taskDate < today : false;

                  return (
                    <tr 
                      key={task.id} 
                      // ✅ ADDED onClick to open modal
                      onClick={() => setSelectedErrand(task)}
                      className="hover:bg-blue-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {task.clientName}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          {task.service}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                        <span className="line-clamp-2">{task.description}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                         <span className="line-clamp-2">{task.address}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-blue-600">
                        {task.phone || "N/A"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                          {taskDate ? taskDate.toLocaleDateString("en-NG", { month: 'short', day: 'numeric', year: '2-digit'}) : "N/A"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls ... (Keep your existing pagination code here) */}
        {taskTotalPages > 1 && (
             <div className="flex flex-wrap justify-center items-center mt-6 gap-3">
            <button onClick={() => setTaskPage((prev) => Math.max(prev - 1, 1))} disabled={taskPage === 1} className="px-3 py-1.5 bg-white border rounded disabled:opacity-50">Previous</button>
            <span className="text-sm">Page {taskPage} of {taskTotalPages}</span>
            <button onClick={() => setTaskPage((prev) => Math.min(prev + 1, taskTotalPages))} disabled={taskPage === taskTotalPages} className="px-3 py-1.5 bg-Brown text-white rounded disabled:opacity-50">Next</button>
          </div>
        )}

        {/* ✅ ERRAND DETAILS MODAL */}
        {selectedErrand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
              
              {/* Header */}
              <div className="bg-Brown px-6 py-4 flex justify-between items-center">
                <h3 className="text-white text-lg font-bold">Errand Details</h3>
                <button 
                  onClick={() => setSelectedErrand(null)}
                  className="text-white hover:text-gray-200 font-bold text-xl"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  
                  {/* Service & Status */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Service Type</p>
                      <p className="text-xl font-bold text-Brown">{selectedErrand.service}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      selectedErrand.status === 'overdue' ? 'bg-red-100 text-red-700' : 
                      selectedErrand.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedErrand.status}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Description</p>
                    <div className="bg-gray-50 p-3 rounded text-gray-700 text-sm leading-relaxed">
                      {selectedErrand.description}
                    </div>
                  </div>

                  {/* Client Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Client Name</p>
                      <p className="text-sm font-medium">{selectedErrand.clientName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                      <a href={`tel:${selectedErrand.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                        {selectedErrand.phone}
                      </a>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Delivery Address</p>
                    <p className="text-sm text-gray-700">{selectedErrand.address}</p>
                    {selectedErrand.location && (
                       <p className="text-xs text-gray-500 mt-1">Area: {selectedErrand.location}</p>
                    )}
                  </div>

                  {/* Financials Grid */}
                  <div className="grid grid-cols-2 gap-4 bg-orange-50 p-3 rounded border border-orange-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Cost</p>
                      <p className="text-lg font-bold text-green-700">
                        ₦{(selectedErrand.estimatedCost || 0).toLocaleString()}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Reference</p>
                      <p className="text-xs font-mono text-gray-600 break-all">
                        {selectedErrand.paymentReference || "N/A"}
                      </p>
                    </div> */}
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t">
                    <span>Created: {new Date(selectedErrand.createdAt).toLocaleDateString()}</span>
                    <span>Due: <span className="text-red-500 font-bold">{new Date(selectedErrand.dueDate).toLocaleDateString()}</span></span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setSelectedErrand(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium text-sm transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </>
    )}
  </section>
)}

      </main>
    </div>
  );
};

export default AgentDashboard;




