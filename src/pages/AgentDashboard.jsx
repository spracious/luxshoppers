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
const [tasks, setTasks] = useState([]); // Array state named 'task' to match your map code
const [isTaskLoading, setIsTaskLoading] = useState(false);
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedNotification(null);
  };

  const handleLogout = () => navigate("/login");
//home
useEffect(() => {
  const fetchHomeData = async () => {
    // Only fetch if this section is active
    if (activeSection !== "Home") return;

    setIsHomeLoading(true);
    setHomeError("");

    try {
      // 1. Get User/Agent ID from Local Storage
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const agentId = currentUser._id || currentUser.id;

      // 2. Fetch Data (Passing agentId as query param)
      const response = await axios.get(`${BASEURL}/admin/home-stats?agentId=${agentId}`);
      const data = response.data; 

      // 3. Format Stats Cards
      // Note: We use the direct keys returned from the backend (data.completedErrands, etc.)
      const formattedStats = [
        {
          title: "Total Errands",
          // We calculate total by summing the statuses returned by the API
          count: (data.pendingErrands || 0) + (data.activeErrands || 0) + (data.completedErrands || 0),
          color: "text-gray-600",
          description: "All time records",
        },
        {
          title: "Completed Errands",
          count: data.completedErrands || 0, 
          color: "text-green-600",
          description: "Deliveries completed",
        },
        {
          title: "Active Errands",
          count: data.activeErrands || 0,
          color: "text-blue-600",
          description: "In Progress",
        },
        // {
        //   title: "Pending Requests",
        //   count: data.pendingErrands || 0,
        //   color: "text-orange-500",
        //   description: "Awaiting Action",
        // },
        {
          title: "Total Agents",
          count: data.totalAgents || 0,
          color: "text-purple-600",
          description: "Registered Agents",
        }
      ];

      setHomeStats(formattedStats);
      // Ensure we pass an empty array if recentActivities is undefined
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

      // ✅ Pass 'page' and 'limit' in query
      const response = await axios.get(`${BASEURL}/admin/tasks?agentId=${agentId}&page=${taskPage}&limit=10`);
      
      // ✅ Handle new response structure
      if (response.data && Array.isArray(response.data.tasks)) {
        setTasks(response.data.tasks);
        setTaskTotalPages(response.data.totalPages);
      } else {
        setTasks([]);
      }

    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setIsTaskLoading(false);
    }
  };

  fetchTasks();
}, [activeSection, taskPage]);

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
          {["Home", "Errand"].map((section) => (
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
                  
                  {/* <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleString("en-NG", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span> */}
                </li>
              ))
            )}
          </ul>
        </div>
      </>
    )}
  </section>
)}

{activeSection === "Errand" && (
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
        <p className="text-gray-500 text-base sm:text-lg">No active tasks found.</p>
      </div>
    ) : (
      <>
        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-md text-left border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Client
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Service
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[160px] sm:min-w-[200px]">
                    Description
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[140px] sm:min-w-[180px]">
                    Address
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Phone
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-left divide-y divide-gray-200">
                {tasks.map((task) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const taskDate = task.dueDate ? new Date(task.dueDate) : null;
                  const isOverdue = taskDate ? taskDate < today : false;

                  return (
                    <tr key={task.id || task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {task.clientName || "Unknown"}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        <span className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
                          {task.service || "N/A"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                        <span className="line-clamp-2">
                          {task.description || "No description"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">
                        <span className="line-clamp-2">
                          {task.address || "No address"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-600 hover:underline">
                        {task.phone ? (
                          <a href={`tel:${task.phone}`}>{task.phone}</a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                            {taskDate ? taskDate.toLocaleDateString("en-NG", {
                              month: 'short', day: 'numeric', year: '2-digit'
                            }) : "N/A"}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] text-red-500 font-bold">Overdue</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Responsive Pagination */}
        {taskTotalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-6 gap-3">
            <button
              onClick={() => setTaskPage((prev) => Math.max(prev - 1, 1))}
              disabled={taskPage === 1}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
              Page {taskPage} of {taskTotalPages}
            </span>

            <button
              onClick={() => setTaskPage((prev) => Math.min(prev + 1, taskTotalPages))}
              disabled={taskPage === taskTotalPages}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-Brown text-white border border-transparent rounded-lg shadow-sm hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
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




