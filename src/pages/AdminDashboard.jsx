import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASEURL } from "../constant";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);


const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Overview");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeMessageTab, setActiveMessageTab] = useState("Unattended");
  const [agents, setAgents] = useState([]);
  const [services, setServices] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const userName = storedUser?.name || "Admin";
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [notification, setNotification] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchService, setSearchService] = useState("");
const [searchLocation, setSearchLocation] = useState("");
const [searchDueDate, setSearchDueDate] = useState("");

  const fetchDashboard = async (currentPage = 1) => {
  setIsLoading(true);
  try {
    const res = await fetch(
      `${BASEURL}/admin/stats?page=${currentPage}&limit=10`
    );
    const data = await res.json();

    setStats(data.stats || []);
    setRecentActivities(data.recentActivities || []);
    setMonthlyRevenue(data.monthlyRevenue || []);
    setTotalPages(data.pagination?.totalPages || 1);

  } catch (error) {
    console.error("Dashboard fetch error:", error);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    fetchDashboard(page);
  }, [page]);


// Chart Data (from backend)
const chartData = {
  labels: monthlyRevenue.map((item) => item.month),
  datasets: [
    {
      label: "Monthly Revenue",
      data: monthlyRevenue.map((item) => item.revenue),
      backgroundColor: "#F59E0B",
      borderRadius: 6,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `₦${context.raw.toLocaleString()}`;
        },
      },
    },
    datalabels: {
      color: "#fff",
      anchor: "center",
      align: "center",
      formatter: (value) => `₦${value.toLocaleString()}`,
      font: {
        weight: "bold",
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return "₦" + value.toLocaleString();
        },
      },
    },
  },
};


  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedNotification(null);
  };

     const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "agent", 
    terms: false,
  }); 


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
    if (!formData.phone)
    validationErrors.phone = "Phone number is required";
  else if (!/^\d{11}$/.test(formData.phone))
    validationErrors.phone = "Phone number must be exactly 11 digits";
    if (!formData.password) validationErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";
    // if (!formData.terms)
    //   validationErrors.terms = "You must agree to the terms and conditions";

    return validationErrors;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Validate inputs
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
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Signup failed");

      // Store user data
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // ✅ CLEAR FORM DATA HERE
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "agent", // Reset to default role (or "user")
        terms: false,
      });

      // Show success message
      setSuccessMessage("Agent created successfully! Redirecting...");
      
      // Redirect after 2 seconds
      setTimeout(() => navigate("/AdminDashboard"), 2000); 

    } catch (error) {
      console.error("Signup Error:", error.message);
      setErrors({ apiError: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const agentsPerPage = 10; // change this to 10 if you want more per page
  const usersPerPage = 10; // change this to 10 if you want more per page


  // Fetch agents from backend
  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      setErrors({}); // clear previous errors

      const res = await fetch(`${BASEURL}/users/users?role=agent`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch agents");

      setAgents(data.users || []);
    } catch (err) {
      setErrors({ fetch: err.message });
      console.error("Fetch agents error:", err);

    } finally {
      setIsLoading(false);
    }
  };

    // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setErrors({}); // clear previous errors

      const res = await fetch(`${BASEURL}/users/users?role=user`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      setUsers(data.users || []);
    } catch (err) {
      setErrors({ fetch: err.message });
      console.error("Fetch users error:", err);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchUsers();
  }, []);

    // Agent Pagination Logic
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = agents.slice(indexOfFirstAgent, indexOfLastAgent);
  const totalAgentPages = Math.ceil(agents.length / agentsPerPage);

    // Handlers
  const handleAgentEdit = (agent) => {
    console.log("Edit", agent);
    // implement edit logic
  };

  const handleAgentDelete = (agentId) => {
    console.log("Delete", agentId);
    // implement delete logic
  };

    // if (isLoading) return <p>Loading agents...</p>;
  if (errors.fetch) return <p className="text-red-500">{errors.fetch}</p>;

      // User Pagination Logic
  const indexOfLastUser = userCurrentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(users.length / usersPerPage);

  // Handlers
  const handleUserEdit = (user) => {
    console.log("Edit", user);
    // implement edit logic
  };

  const handleUserDelete = (userId) => {
    console.log("Delete", userId);
    // implement delete logic
  };

  // if (isLoading) return <p>Loading users...</p>;
  if (errors.fetch) return <p className="text-red-500">{errors.fetch}</p>;

  
  useEffect(() => {
  const fetchStats = async () => {
    const res = await axios.get(`${BASEURL}/admin/service-stats`);
    setServices(res.data);
  };

  fetchStats();
}, []);

// 1️⃣ Define the function OUTSIDE useEffect so buttons can use it
  const fetchErrands = async () => {
    try {
      // Optional: Handle status mapping if your tabs are "In Progress" but API needs "in-progress"
      let statusParam = activeMessageTab;
      if (activeMessageTab === "In Progress") statusParam = "in-progress"; 
      if (activeMessageTab === "Over Due") statusParam = "overdue";
      if (activeMessageTab === "Pending") statusParam = "pending";
      if (activeMessageTab === "Completed") statusParam = "completed";

      const res = await axios.get(
        `${BASEURL}/admin/errands`,
        {
          params: {
            status: statusParam, // Use the mapped status
            page,
            limit: 10,
          },
        }
      );

      setFilteredNotifications(res.data.errands);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching errands:", error);
    }
  };

  // 2️⃣ Call it INSIDE useEffect when tabs or page change
  useEffect(() => {
    fetchErrands();
  }, [activeMessageTab, page]);





    // const generatePassword = () => {
    //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    //   return Array(10)
    //     .fill("")
    //     .map(() => chars[Math.floor(Math.random() * chars.length)])
    //     .join("");
    // };
  
    // Handle input changes & auto-generate username and password
    // const handleChange = (event) => {
    //   const { name, value } = event.target;
  
    //   setFormData((prevData) => {
    //     let updatedData = { ...prevData, [name]: value };
  
    //     // Auto-generate username and password when full name is entered
    //     if (name === "fullName") {
    //       const randomNum = Math.floor(Math.random() * 900) + 100;
    //       updatedData.username = `Agent${randomNum}`;
    //       updatedData.password = generatePassword(); // Generate password
    //       updatedData.confirmPassword = updatedData.password; // Autofill confirm password
    //     }
  
    //     return updatedData;
    //   });
    // };
  
    // Handle form submission
    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   console.log("Form submitted:", formData);
    // };

//     const handleDelete = (index) => {
//   const updatedAgents = agents.filter((_, i) => i !== index);
//   setAgents(updatedAgents);
// };



  const handleLogout = () => navigate("/login");



  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-Brown text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-1xl font-bold text-Elegant-Gold">Admin {userName},</h1>
          <p className="text-sm text-Soft-beige mt-1">Welcome back!</p>
        </div>
        <nav className="flex-grow p-4">
          {["Overview", "Create Agent", "Agents", "Users", "Services", "Errands", "Reports", "Settings"].map(
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
      {/* Quick Stats */}
      <h3 className="text-lg font-bold text-Brown mb-4">Quick Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h4 className="text-sm text-Elegant-Gold font-bold">{stat.label}</h4>
              <p className="text-2xl font-bold text-Brown mt-2">{stat.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Monthly Revenue Chart */}
      <h3 className="text-lg font-bold text-Brown mt-8 mb-4">Monthly Revenue</h3>
     {monthlyRevenue.length > 0 ? (
  <Bar data={chartData} options={chartOptions} />
) : (
  <p className="text-center text-Brown py-4">
    Revenue is data loading....
  </p>
)}


      {/* Recent Activities */}
      <h3 className="text-lg font-bold text-Brown mt-8 mb-4">Recent Activities</h3>
  <ul className="bg-gray-200 p-4 rounded-lg shadow-md">
  {isLoading ? (
    <li className="flex justify-center items-center py-6">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    </li>
  ) : recentActivities.length === 0 ? (
    <li className="text-center text-Brown py-4">
      No recent activities found.
    </li>
  ) : (
    recentActivities.map((activity, index) => (
      <li
        key={index}
        className="flex justify-between items-center py-2 border-b last:border-b-0"
      >
        <span className="text-lg text-Brown">
          {activity.description}
        </span>

        <span className="text-lg text-Brown">
          {new Date(activity.timestamp).toLocaleString("en-NG", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}
        </span>
      </li>
    ))
  )}
</ul>


      {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center mt-4 space-x-2">
    <button
      disabled={page === 1}
      onClick={() => setPage((prev) => prev - 1)}
      className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50"
    >
      Prev
    </button>
    <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage((prev) => prev + 1)}
      className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

    </section>
        )}

{activeSection === "Create Agent" && formData && (
  <section className="max-w-2xl mx-auto bg-Ivory p-8 rounded-lg shadow-lg">
  <h2 className="text-3xl font-bold text-Brown mb-6 text-center">
    Agent Registration
  </h2>
     {errors.apiError && <p className="text-red-500 text-sm text-center">{errors.apiError}</p>}
{successMessage && (
  <div className="mb-4 bg-green border border-green-400 text-green-700 px-4 py-3 rounded relative text-center">
    <strong className="font-bold">Success!</strong>
    <span className="block sm:inline"> {successMessage}</span>
  </div>
)}
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
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

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

          {/* <div className="flex items-center">
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
          </div> */}
          {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-Brown text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-Brown"
          >
            {isSubmitting ? "Creating..." : "Create Agent"}
          </button>
        </form>
</section>
)}

{activeSection === "Agents" && (

   <section className="max-w-8xl mx-auto bg-Soft-beige rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-lg md:text-3xl font-bold text-Brown mb-6 text-center">
        Registered Agents
      </h2>

      {isLoading ? (
        <p className="text-center">Loading agents...</p>
      ) : errors.fetch ? (
        <p className="text-center text-red-500">{errors.fetch}</p>
      ) : (
        <>
          <div className="overflow-hidden">
            <table className="w-full bg-gray-100 border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm md:text-base">
                  <th className="py-2 px-3 md:px-4 border">Name</th>
                  <th className="py-2 px-3 md:px-4 border">Email</th>
                  <th className="py-2 px-3 md:px-4 border">Phone</th>
                  <th className="py-2 px-3 md:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentAgents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No agents found.
                    </td>
                  </tr>
                ) : (
                  currentAgents.map((agent) => (
                    <tr key={agent._id} className="border text-center text-sm">
                      <td className="py-2 px-3 md:px-4">{agent.name}</td>
                      <td className="py-2 px-3 md:px-4">{agent.email}</td>
                      <td className="py-2 px-3 md:px-4">{agent.phone}</td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleAgentEdit(agent)}
                            className="bg-gray-500 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-gray-700 transition text-xs md:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAgentDelete(agent._id)}
                            className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-red-600 transition text-xs md:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalAgentPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm font-medium">
                Page {currentPage} of {totalAgentPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalAgentPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
        
        )}

{activeSection === "Users" && (

   <section className="max-w-8xl mx-auto bg-Soft-beige rounded-lg shadow-lg p-4 md:p-6">
      <h2 className="text-lg md:text-3xl font-bold text-Brown mb-6 text-center">
        Registered Users
      </h2>

      {isLoading ? (
        <p className="text-center">Loading users...</p>
      ) : errors.fetch ? (
        <p className="text-center text-red-500">{errors.fetch}</p>
      ) : (
        <>
          <div className="overflow-hidden">
            <table className="w-full bg-gray-100 border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm md:text-base">
                  <th className="py-2 px-3 md:px-4 border">Name</th>
                  <th className="py-2 px-3 md:px-4 border">Email</th>
                  <th className="py-2 px-3 md:px-4 border">Phone</th>
                  <th className="py-2 px-3 md:px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user._id} className="border text-center text-sm">
                      <td className="py-2 px-3 md:px-4">{user.name}</td>
                      <td className="py-2 px-3 md:px-4">{user.email}</td>
                      <td className="py-2 px-3 md:px-4">{user.phone}</td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleUserEdit(user)}
                            className="bg-gray-500 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-gray-700 transition text-xs md:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUserDelete(user._id)}
                            className="bg-red-500 text-white px-2 py-1 md:px-3 md:py-1 rounded hover:bg-red-600 transition text-xs md:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalUserPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={() => setUserCurrentPage((prev) => prev - 1)}
                disabled={userCurrentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm font-medium">
                Page {userCurrentPage} of {totalUserPages}
              </span>

              <button
                onClick={() => setUserCurrentPage((prev) => prev + 1)}
                disabled={userCurrentPage === totalUserPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
        
        )}

        {activeSection === "Services" && (
          <section>
      <h2 className="text-lg md:text-3xl font-bold text-Brown mb-6 text-center">
              Service Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="bg-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold text-Elegant-Gold">
                    {service.name}
                  </h4>
                    <p className="text-lg mt-2 text-Brown">
                    Pending: {" "}
                    <span className="font-bold text-Brown">
                      {service.pending}
                    </span>
                  </p>
                  <p className="text-lg mt-2 text-Brown">
                    In Progress: {" "}
                    <span className="font-bold text-yellow-500">
                      {service.in-progress}
                    </span>
                  </p>
                  <p className="text-lg text-Brown">
                    Completed: {" "}
                    <span className="font-bold text-green">
                      {service.completed}
                    </span>
                  </p>
                  <p className="text-lg text-Brown">
                    Over Due: {" "}
                    <span className="font-bold text-red-500">
                      {service.overdue}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

{activeSection === "Errands" && (
  <section>
    <h3 className="text-lg md:text-3xl font-bold text-Brown mb-6 text-center">
      Errands
    </h3>

    {/* Tabs */}
    <div className="flex flex-wrap gap-2 mb-4 justify-start">
      {["Pending", "In Progress", "Over Due", "Completed"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveMessageTab(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeMessageTab === tab
              ? "bg-Brown text-white"
              : "bg-Elegant-Gold text-white hover:bg-orange-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Search / Filters */}
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      <input
        type="text"
        placeholder="Search by Service"
        className="px-3 py-2 rounded border border-gray-300 w-48"
        value={searchService}
        onChange={(e) => setSearchService(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search by Location"
        className="px-3 py-2 rounded border border-gray-300 w-48"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />
      <input
        type="date"
        className="px-3 py-2 rounded border border-gray-300"
        value={searchDueDate}
        onChange={(e) => setSearchDueDate(e.target.value)}
      />
    </div>

    {/* Success Message */}
    {successMessage && (
      <div className="fixed top-5 right-5 z-50 bg-green text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
        {successMessage}
      </div>
    )}

    {/* Errands Table */}
    {filteredNotifications.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left text-Brown">
              <th className="py-2 px-4">Service</th>
              <th className="py-2 px-4">Errand</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Voucher Type</th>
              <th className="py-2 px-4">Voucher Amount</th>
              <th className="py-2 px-4">Total Cost</th>
              <th className="py-2 px-4">Created Date</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredNotifications
              .filter((notif) => {
                // Filter by search inputs
                const matchService = notif.title
                  .toLowerCase()
                  .includes(searchService.toLowerCase());
                const matchLocation = notif.location
                  .toLowerCase()
                  .includes(searchLocation.toLowerCase());
                const matchDueDate =
                  !searchDueDate ||
                  (notif.dueDate &&
                    new Date(notif.dueDate).toISOString().slice(0, 10) ===
                      searchDueDate);
                return matchService && matchLocation && matchDueDate;
              })
              .map((notif) => {
                // Automatic Overdue Detection
                const now = new Date();
                const isOverdue =
                  notif.status !== "completed" &&
                  notif.dueDate &&
                  new Date(notif.dueDate) < now;

                if (isOverdue && notif.status !== "overdue") {
                  notif.status = "overdue";
                  axios
                    .patch(`${BASEURL}/admin/errands/${notif.id || notif._id}/status`, {
                      status: "overdue",
                    })
                    .catch(console.error);
                }

                // Show only rows matching the active tab
                const showRow =
                  (activeMessageTab === "Pending" && notif.status === "pending") ||
                  (activeMessageTab === "In Progress" && notif.status === "in-progress") ||
                  (activeMessageTab === "Over Due" && notif.status === "overdue") ||
                  (activeMessageTab === "Completed" && notif.status === "completed");

                if (!showRow) return null;

                return (
                  <tr key={notif.id || notif._id} className="hover:bg-gray-200 text-left">
                    <td className="py-2 px-4">{notif.title}</td>
                    <td className="py-2 px-4">{notif.details}</td>
                    <td className="py-2 px-4">{notif.location}</td>
                    <td className="py-2 px-4">{notif.address}</td>
                    <td className="py-2 px-4">{notif.voucher?.category || "N/A"}</td>
                    <td className="py-2 px-4">{notif.voucher?.amount || "N/A"}</td>
                    <td className="py-2 px-4">{notif.estimatedCost}</td>
                    <td className="py-2 px-4">{new Date(notif.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-4">
                      {notif.dueDate
                        ? new Date(notif.dueDate).toLocaleDateString()
                        : "Not Set"}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                      {/* Ongoing Button */}
                      {notif.status === "pending" && (
                        <button
                          className="bg-orange-300 px-3 py-1 rounded text-sm font-medium text-Brown hover:bg-orange-400 w-full sm:w-auto transition"
                          onClick={async () => {
                            try {
                              await axios.patch(
                                `${BASEURL}/admin/errands/${notif.id || notif._id}/status`,
                                { status: "in-progress" }
                              );
                              fetchErrands();
                              setSuccessMessage("Errand moved to Ongoing! 🚀");
                              setTimeout(() => setSuccessMessage(""), 3000);
                            } catch (error) {
                              console.error("Update failed:", error);
                              alert("Failed to update status.");
                            }
                          }}
                        >
                          Ongoing
                        </button>
                      )}

                      {/* Completed Button */}
                      {notif.status !== "completed" && (
                        <button
                          disabled={notif.status === "pending"}
                          className={`px-3 py-1 rounded text-sm font-medium w-full sm:w-auto transition ${
                            notif.status === "pending"
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-orange-300 text-white hover:bg-orange-400"
                          }`}
                          onClick={async () => {
                            if (notif.status === "pending") return;
                            try {
                              await axios.patch(
                                `${BASEURL}/admin/errands/${notif.id || notif._id}/status`,
                                { status: "completed" }
                              );
                              fetchErrands();
                              setSuccessMessage("Errand moved to Completed! 🎉");
                              setTimeout(() => setSuccessMessage(""), 3000);
                            } catch (error) {
                              console.error("Update failed:", error);
                              alert("Failed to update status.");
                            }
                          }}
                        >
                          Completed
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-Brown mt-4">Select tab to see errands.</p>
    )}

    {/* Pagination */}
    <div className="flex justify-center mt-4 space-x-2">
      <button
        className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
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
            {/* <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.
        </p>
      </footer> */}
    </div>
  );
};

export default AdminDashboard;
















