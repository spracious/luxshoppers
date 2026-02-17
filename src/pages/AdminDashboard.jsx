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
const [searchUser, setSearchUser] = useState("");
const [reportData, setReportData] = useState([]);
const [reportStats, setReportStats] = useState({ total: 0, monthly: 0, pending: 0 });
const [reportLoading, setReportLoading] = useState(false);

const [filters, setFilters] = useState({
  type: "", // matches backend: agents, users, errands, payments
  startDate: "",
  endDate: "",
  sortBy: "date",
});
  const [loading, setLoading] = useState(false);
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
      setSuccessMessage("Agent created successfully!");
      
      // Redirect after 2 seconds
  setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
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
const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedAgent, setSelectedAgent] = useState(null);
const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  phone: "",
});

 const handleAgentEdit = (agent) => {
  setSelectedAgent(agent);
  setEditForm({
    name: agent.name || "",
    email: agent.email || "",
    phone: agent.phone || "",
  });
  setIsEditOpen(true);
};

const handleEditChange = (e) => {
  setEditForm({
    ...editForm,
    [e.target.name]: e.target.value,
  });
};

const handleAgentUpdate = async () => {
  try {
    const res = await fetch(
      `${BASEURL}/admin/users/${selectedAgent._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setIsEditOpen(false);
      fetchAgents(); // refresh list
        setSuccessMessage("Agent updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};

  const handleAgentDelete = async (agentId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this agent?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
        `${BASEURL}/admin/users/${agentId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage("Agent deleted successfully!");
      
      // Remove agent from state instantly (no refetch)
      setAgents((prev) => prev.filter((agent) => agent._id !== agentId));

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};


    // if (isLoading) return <p>Loading agents...</p>;
  if (errors.fetch) return <p className="text-red-500">{errors.fetch}</p>;

      // User Pagination Logic
  const indexOfLastUser = userCurrentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(users.length / usersPerPage);

  // Handlers
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [userEditForm, setUserEditForm] = useState({
  name: "",
  email: "",
  phone: "",
});

 const handleUserEdit = (user) => {
  setSelectedUser(user);
  setUserEditForm({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  setIsUserEditOpen(true);
};

const handleUserEditChange = (e) => {
  setUserEditForm({
    ...userEditForm,
    [e.target.name]: e.target.value,
  });
};

const handleUserUpdate = async () => {
  try {
    const res = await fetch(
      `${BASEURL}/admin/users/${selectedUser._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userEditForm),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setIsUserEditOpen(false);
      fetchUsers(); // refresh users list
        setSuccessMessage("User updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};


  const handleUserDelete = async (userId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `${BASEURL}/admin/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage("User deleted successfully!");

      setUsers((prev) => prev.filter((user) => user._id !== userId));

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};


  // if (isLoading) return <p>Loading users...</p>;
  if (errors.fetch) return <p className="text-red-500">{errors.fetch}</p>;
 
 
const fetchStats = async () => {
  try {
    const res = await axios.get(`${BASEURL}/admin/service-stats`);
    setServices(res.data);
  } catch (error) {
    console.error("Failed to fetch service stats:", error);
  }
};

useEffect(() => {
  fetchStats();
}, []);


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

  useEffect(() => {
    fetchErrands();
  }, [activeMessageTab, page]);


// 2️⃣ FETCH REPORTS & STATS
const fetchReports = async () => {
  try {
    setReportLoading(true);

    // ✅ 1. Get Token from LocalStorage
    // Adjust "currentUser" if you store the token under a different key like "token"
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const token = storedUser?.token || localStorage.getItem("token");

    if (!token) {
      console.error("No authentication token found. Please log in.");
      return;
    }

    // ✅ 2. Create Header Config
    const authHeaders = {
      Authorization: `Bearer ${token}`,
    };

    // ✅ 3. Prepare Query Params
    const params = {
      type: filters.type,
      startDate: filters.startDate,
      endDate: filters.endDate,
      sortBy: filters.sortBy,
    };

    // ✅ 4. Pass 'headers' AND 'params' to Axios
    const [dataRes, statsRes] = await Promise.all([
      axios.get(`${BASEURL}/admin/reports`, {
        headers: authHeaders, // <--- Added
        params: params,
      }),
      axios.get(`${BASEURL}/admin/reports/stats`, {
        headers: authHeaders, // <--- Added
        params: { type: filters.type },
      }),
    ]);

    setReportData(dataRes.data.reports || []);
    setReportStats(statsRes.data || { total: 0, monthly: 0, pending: 0 });

  } catch (error) {
    console.error("Error fetching reports:", error);
    if (error.response && error.response.status === 401) {
       alert("Session expired. Please login again.");
    }
  } finally {
    setReportLoading(false);
  }
};

// 3️⃣ HANDLE INPUT CHANGE
const handleFilterChange = (e) => {
  setFilters({ ...filters, [e.target.name]: e.target.value });
};

// 4️⃣ LOAD DATA ON ENTERING SECTION
useEffect(() => {
  if (activeSection === "Reports") {
    fetchReports();
  }
}, [activeSection]);


const handleExportExcel = async () => {
  try {
    const params = {
      type: filters.type,
      startDate: filters.startDate,
      endDate: filters.endDate,
      sortBy: filters.sortBy,
    };

    const response = await axios.get(
      `${BASEURL}/admin/reports/export`,
      {
        params,
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reports_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("Export failed:", error);
  }
};

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
          {["Overview", "Create Agent", "Agents", "Users", "Services", "Errands", "Reports"].map(
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
  <section className="w-full">
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
      // Added a wrapper with relative class and responsive height to ensure Chart.js fits
      <div className="w-full relative h-[300px] md:h-auto">
        <Bar data={chartData} options={chartOptions} />
      </div>
    ) : (
      <p className="text-center text-Brown py-4">Revenue is data loading....</p>
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
            // UPDATED: Stack vertically on mobile (flex-col), horizontally on tablet (sm:flex-row)
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-2 border-b last:border-b-0 gap-1 sm:gap-0"
          >
            {/* UPDATED: Responsive text size */}
            <span className="text-sm sm:text-base md:text-lg text-Brown font-medium">
              {activity.description}
            </span>

            {/* UPDATED: Responsive text size and color/opacity for hierarchy on mobile */}
            <span className="text-xs sm:text-base md:text-lg text-Brown/80 sm:text-Brown">
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
      // UPDATED: Added flex-wrap and gap to handle small screens safely
      <div className="flex flex-wrap justify-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50 text-sm sm:text-base"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-sm sm:text-base flex items-center">{`Page ${page} of ${totalPages}`}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50 text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    )}
  </section>
)}

{activeSection === "Create Agent" && formData && (
  <section className="w-full max-w-2xl mx-auto bg-Ivory p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
    <h2 className="text-2xl sm:text-3xl font-bold text-Brown mb-4 sm:mb-6 text-center">
      Agent Registration
    </h2>
    
    {errors.apiError && (
      <p className="text-red-500 text-sm text-center">{errors.apiError}</p>
    )}
    
    {successMessage && (
      <div className="mb-4 bg-green border border-green-400 text-green-700 px-4 py-3 rounded relative text-center">
        <strong className="font-bold">Success!</strong>
        <span className="block sm:inline"> {successMessage}</span>
      </div>
    )}

    <form className="mt-4 sm:mt-6 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
      <div>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none transition duration-150"
          placeholder="Full Name"
        />
        {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none transition duration-150"
          placeholder="Email Address"
        />
        {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          id="phone"
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none transition duration-150"
          placeholder="Phone Number"
        />
        {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none transition duration-150"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 sm:py-3 border rounded-md text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none transition duration-150"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>
        )}
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
        className="w-full bg-Brown text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-Brown transition duration-200 text-sm sm:text-base"
      >
        {isSubmitting ? "Creating..." : "Create Agent"}
      </button>
    </form>
  </section>
)}

{activeSection === "Agents" && (
  <section className="w-full max-w-7xl mx-auto bg-Soft-beige rounded-lg shadow-lg p-3 sm:p-4 md:p-6 relative">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-Brown mb-4 md:mb-6 text-center">
      Registered Agents
    </h2>

    {isLoading ? (
      <p className="text-center py-4">Loading agents...</p>
    ) : errors.fetch ? (
      <p className="text-center text-red-500 py-4">{errors.fetch}</p>
    ) : (
      <>
        {/* Added overflow-x-auto to make table scrollable on mobile */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full bg-gray-100 min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs sm:text-sm md:text-base">
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-left">Name</th>
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-left">Email</th>
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-center">Phone</th>
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentAgents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-sm">
                    No agents found.
                  </td>
                </tr>
              ) : (
                currentAgents.map((agent) => (
                  <tr key={agent._id} className="border text-left text-xs sm:text-sm hover:bg-white transition-colors">
                    <td className="py-2 px-2 sm:px-3 md:px-4 whitespace-nowrap">{agent.name}</td>
                    <td className="py-2 px-2 sm:px-3 md:px-4 whitespace-nowrap">{agent.email}</td>
                    <td className="py-2 px-2 sm:px-3 md:px-4 text-center whitespace-nowrap">{agent.phone}</td>
                    <td className="py-2 px-2 sm:px-4">
                      {/* Stack buttons on very small screens, row on larger */}
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                        <button
                          onClick={() => handleAgentEdit(agent)}
                          className="w-full sm:w-auto bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAgentDelete(agent._id)}
                          className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
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

        {/* Pagination */}
        {totalAgentPages > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-4 gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Previous
            </button>

            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
              Page {currentPage} of {totalAgentPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalAgentPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        )}
      </>
    )}

    {/* ✅ SUCCESS POPUP */}
    {successMessage && (
      // Adjusted to be safe on mobile (max-width)
      <div className="fixed top-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-auto bg-green text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg shadow-lg z-50 transition-all duration-300 text-center sm:text-left text-sm sm:text-base">
        {successMessage}
      </div>
    )}

    {/* ✅ EDIT MODAL INSIDE SECTION */}
    {isEditOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        {/* Changed width to percentage on mobile, fixed on desktop */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:w-96 p-6 overflow-y-auto max-h-[90vh]">
          <h3 className="text-lg sm:text-xl text-Brown font-bold mb-4 text-center">
            Edit Agent
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="w-full border p-2 rounded text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none"
              placeholder="Name"
            />

            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              className="w-full border p-2 rounded text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none"
              placeholder="Email"
            />

            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              className="w-full border p-2 rounded text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none"
              placeholder="Phone"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm sm:text-base"
            >
              Cancel
            </button>

            <button
              onClick={handleAgentUpdate}
              className="px-4 py-2 bg-Elegant-Gold text-white rounded hover:bg-blue-700 text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )}
  </section>
)}

{activeSection === "Users" && (
  <section className="w-full max-w-7xl mx-auto bg-Soft-beige rounded-lg shadow-lg p-3 sm:p-4 md:p-6 relative">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-Brown mb-4 md:mb-6 text-center">
      Registered Users
    </h2>

    {isLoading ? (
      <p className="text-center py-4">Loading users...</p>
    ) : errors.fetch ? (
      <p className="text-center text-red-500 py-4">{errors.fetch}</p>
    ) : (
      <>
        {/* Added overflow-x-auto to handle table width on mobile */}
        <div className="w-full overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full bg-gray-100 min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs sm:text-sm md:text-base">
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-left">Name</th>
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-left">Email</th>
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-center">Phone</th>
                <th className="py-2 px-2 sm:px-3 md:px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-sm">
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="border text-left text-xs sm:text-sm hover:bg-white transition-colors">
                    <td className="py-2 px-2 sm:px-3 md:px-4 whitespace-nowrap">{user.name}</td>
                    <td className="py-2 px-2 sm:px-3 md:px-4 whitespace-nowrap">{user.email}</td>
                    <td className="py-2 px-2 sm:px-3 md:px-4 text-center whitespace-nowrap">{user.phone}</td>
                    <td className="py-2 px-2 sm:px-4">
                      {/* Stack buttons vertically on small screens, horizontal on larger */}
                      <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                        <button
                          onClick={() => handleUserEdit(user)}
                          className="w-full sm:w-auto bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 transition text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleUserDelete(user._id)}
                          className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
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
          <div className="flex flex-wrap justify-center items-center mt-4 gap-2 sm:gap-4">
            <button
              onClick={() => setUserCurrentPage((prev) => prev - 1)}
              disabled={userCurrentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Previous
            </button>

            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
              Page {userCurrentPage} of {totalUserPages}
            </span>

            <button
              onClick={() => setUserCurrentPage((prev) => prev + 1)}
              disabled={userCurrentPage === totalUserPages}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        )}
      </>
    )}

    {/* ✅ SUCCESS POPUP */}
    {successMessage && (
      // Responsive positioning: full width/centered on mobile, top-right on desktop
      <div className="fixed top-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-auto bg-green text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg shadow-lg z-50 transition-all duration-300 text-center sm:text-left text-sm sm:text-base">
        {successMessage}
      </div>
    )}

    {/* ✅ USER EDIT MODAL */}
    {isUserEditOpen && (
      // Changed to fixed inset-0 to ensure it covers screen correctly on mobile scrolling
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        {/* Responsive width: 100% on mobile (max-sm), fixed width on tablet/desktop */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:w-96 p-6 overflow-y-auto max-h-[90vh]">
          <h3 className="text-lg sm:text-xl text-Brown font-bold mb-4 text-center">
            Edit User
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={userEditForm.name}
              onChange={handleUserEditChange}
              className="w-full border p-2 rounded text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none"
              placeholder="Name"
            />

            <input
              type="email"
              name="email"
              value={userEditForm.email}
              onChange={handleUserEditChange}
              className="w-full border p-2 rounded text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none"
              placeholder="Email"
            />

            <input
              type="text"
              name="phone"
              value={userEditForm.phone}
              onChange={handleUserEditChange}
              className="w-full border p-2 rounded text-sm sm:text-base focus:ring-Brown focus:border-Brown outline-none"
              placeholder="Phone"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setIsUserEditOpen(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm sm:text-base"
            >
              Cancel
            </button>

            <button
              onClick={handleUserUpdate}
              className="px-4 py-2 bg-Elegant-Gold text-white rounded hover:bg-blue-700 text-sm sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )}
  </section>
)}

{activeSection === "Services" && (
  <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6">
    <h2 className="text-2xl sm:text-3xl font-bold text-Brown mb-6 text-center">
      Service Analytics
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {services.map((service) => (
        <div
          key={service.name}
          className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col justify-between"
        >
          <h4 className="text-base sm:text-lg font-bold text-Elegant-Gold mb-3 border-b border-gray-300 pb-2">
            {service.name}
          </h4>

          <div className="space-y-2">
            <p className="text-sm sm:text-base text-Brown flex justify-between items-center">
              Pending:{" "}
              <span className="font-bold text-Brown bg-white px-2 py-0.5 rounded shadow-sm">
                {service.pending || 0}
              </span>
            </p>

            <p className="text-sm sm:text-base text-Brown flex justify-between items-center">
              In Progress:{" "}
              <span className="font-bold text-yellow-600 bg-white px-2 py-0.5 rounded shadow-sm">
                {service.inProgress || 0}
              </span>
            </p>

            <p className="text-sm sm:text-base text-Brown flex justify-between items-center">
              Completed:{" "}
              <span className="font-bold text-green bg-white px-2 py-0.5 rounded shadow-sm">
                {service.completed || 0}
              </span>
            </p>

            <p className="text-sm sm:text-base text-Brown flex justify-between items-center">
              Overdue:{" "}
              <span className="font-bold text-red-500 bg-white px-2 py-0.5 rounded shadow-sm">
                {service.overdue || 0}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

{activeSection === "Errands" && (
  <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pb-6">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-Brown mb-6 text-center">
      Errands
    </h2>

    {/* Tabs */}
    <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
      {["Pending", "In Progress", "Over Due", "Completed"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveMessageTab(tab)}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
            activeMessageTab === tab
              ? "bg-Brown text-white shadow"
              : "bg-Elegant-Gold text-white hover:bg-orange-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Search / Filters */}
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 items-stretch sm:items-center">
      <input
        type="text"
        placeholder="Search by User"
        className="px-3 py-2 rounded border border-gray-300 w-full sm:w-48 text-sm focus:ring-Brown focus:border-Brown outline-none"
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search by Service"
        className="px-3 py-2 rounded border border-gray-300 w-full sm:w-48 text-sm focus:ring-Brown focus:border-Brown outline-none"
        value={searchService}
        onChange={(e) => setSearchService(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search by Location"
        className="px-3 py-2 rounded border border-gray-300 w-full sm:w-48 text-sm focus:ring-Brown focus:border-Brown outline-none"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />
    </div>

    {/* Success Message */}
    {successMessage && (
      <div className="fixed top-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-auto z-50 bg-green text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg shadow-lg animate-bounce text-center text-sm sm:text-base">
        {successMessage}
      </div>
    )}

    {/* Errands Table */}
    {filteredNotifications.length > 0 ? (
      <div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-200">
        {/* Added min-w-[1000px] to force horizontal scroll on mobile instead of squishing columns */}
        <table className="min-w-[1000px] w-full bg-gray-100">
          <thead>
            <tr className="bg-gray-200 text-left text-Brown text-xs sm:text-sm uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Client</th>
              <th className="py-3 px-4 font-semibold">Service</th>
              <th className="py-3 px-4 font-semibold">Errand</th>
              <th className="py-3 px-4 font-semibold">Location</th>
              <th className="py-3 px-4 font-semibold">Address</th>
              <th className="py-3 px-4 font-semibold">Voucher</th>
              <th className="py-3 px-4 font-semibold">Total Cost</th>
              <th className="py-3 px-4 font-semibold">Created Date & Time</th>
              <th className="py-3 px-4 font-semibold">Due Date</th>
              <th className="py-3 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredNotifications
              .filter((notif) => {
                const matchService = notif.title
                  ?.toLowerCase()
                  .includes(searchService.toLowerCase());

                const matchLocation = notif.location
                  ?.toLowerCase()
                  .includes(searchLocation.toLowerCase());

                const matchUser = notif.user?.name
                  ?.toLowerCase()
                  .includes(searchUser.toLowerCase());

                return matchService && matchLocation && matchUser;
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
                    .patch(
                      `${BASEURL}/admin/errands/${
                        notif.id || notif._id
                      }/status`,
                      {
                        status: "overdue",
                      }
                    )
                    .catch(console.error);
                }

                // Show only rows matching the active tab
                const showRow =
                  (activeMessageTab === "Pending" &&
                    notif.status === "pending") ||
                  (activeMessageTab === "In Progress" &&
                    notif.status === "in-progress") ||
                  (activeMessageTab === "Over Due" &&
                    notif.status === "overdue") ||
                  (activeMessageTab === "Completed" &&
                    notif.status === "completed");

                if (!showRow) return null;

                return (
                  <tr
                    key={notif.id || notif._id}
                    className="hover:bg-white text-left transition-colors text-sm text-gray-700"
                  >
                    <td className="py-3 px-4 whitespace-nowrap font-medium">
                      {notif.user?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{notif.title}</td>
                    <td className="py-3 px-4 min-w-[200px]">{notif.details}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{notif.location}</td>
                    <td className="py-3 px-4 min-w-[200px]">{notif.address}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {notif.voucher?.category || "N/A"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {notif.estimatedCost}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(notif.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {notif.dueDate
                        ? new Date(notif.dueDate).toLocaleDateString()
                        : "Not Set"}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      {/* Responsive Flex: Column on mobile, Row on Tablet/Desktop */}
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        {/* Ongoing Button */}
                        {notif.status === "pending" && (
                          <button
                            className="bg-orange-300 px-3 py-1.5 rounded text-xs sm:text-sm font-medium text-Brown hover:bg-orange-400 w-full sm:w-auto transition shadow-sm whitespace-nowrap"
                            onClick={async () => {
                              try {
                                await axios.patch(
                                  `${BASEURL}/admin/errands/${
                                    notif.id || notif._id
                                  }/status`,
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
                            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-medium w-full sm:w-auto transition shadow-sm whitespace-nowrap ${
                              notif.status === "pending"
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-orange-300 text-white hover:bg-orange-400"
                            }`}
                            onClick={async () => {
                              if (notif.status === "pending") return;
                              try {
                                await axios.patch(
                                  `${BASEURL}/admin/errands/${
                                    notif.id || notif._id
                                  }/status`,
                                  { status: "completed" }
                                );
                                fetchErrands();
                                setSuccessMessage(
                                  "Errand moved to Completed! 🎉"
                                );
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
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-Brown mt-8 text-center bg-gray-100 p-4 rounded-lg">
        No errands found for the selected tab.
      </p>
    )}

    {/* Pagination */}
    <div className="flex flex-wrap justify-center mt-6 gap-2">
      <button
        className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50 text-sm sm:text-base hover:bg-opacity-90 transition"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="px-2 py-2 text-sm sm:text-base flex items-center">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-Brown text-white rounded disabled:opacity-50 text-sm sm:text-base hover:bg-opacity-90 transition"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  </section>
)}

{activeSection === "Reports" && (
  <section className="p-4 sm:p-6 bg-gray-50 rounded-lg shadow-md w-full max-w-full md:max-w-7xl mx-auto">
    <header className="mb-6">
      <h3 className="text-xl sm:text-2xl font-extrabold text-Brown mb-2">Reports</h3>
      <p className="text-sm text-gray-600">
        Analyze and generate detailed reports to gain insights into your business performance.
      </p>
    </header>

    {/* 🔹 FILTER SECTION */}
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md mb-8 w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
        <h4 className="text-base sm:text-lg font-bold text-Brown">Filters</h4>
        <button
          onClick={() => {
            setFilters({ type: "", startDate: "", endDate: "", sortBy: "date" });
            fetchReports();
          }}
          className="w-full sm:w-auto font-bold px-6 py-2 bg-blue-600 text-red-500 rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base"
        >
          Reset Filters
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm"
          >
            <option value="">Select Report Type</option>
            <option value="agents">Agents</option>
            <option value="users">Users</option>
            <option value="errands">Errands</option>
            <option value="payments">Payments</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full sm:w-1/2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full sm:w-1/2 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm"
          >
            <option value="date">Date Created</option>
            <option value="amount">Amount / Cost</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-center sm:justify-start">
        <button
          onClick={fetchReports}
          className="w-full sm:w-auto font-bold px-6 py-2 bg-blue-600 text-Brown rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base"
        >
          {reportLoading ? "Loading..." : "Apply Filters"}
        </button>
      </div>
    </div>

    {/* 🔹 DATA TABLE */}
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h4 className="text-base sm:text-lg font-bold text-Brown">Generated Reports Data</h4>
        <button
          onClick={handleExportExcel}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-Brown rounded-lg shadow-md hover:bg-green-700 text-sm sm:text-base"
        >
          Export Data
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
        <table className="min-w-full w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-Brown border-b border-gray-200 whitespace-nowrap text-sm">
                Name / Title
              </th>
              <th className="text-left px-4 py-3 font-semibold text-Brown border-b border-gray-200 whitespace-nowrap text-sm">
                Category
              </th>
              <th className="text-left px-4 py-3 font-semibold text-Brown border-b border-gray-200 whitespace-nowrap text-sm">
                Details (Email/Cost)
              </th>
              <th className="text-left px-4 py-3 font-semibold text-Brown border-b border-gray-200 whitespace-nowrap text-sm">
                Date
              </th>
              <th className="text-left px-4 py-3 font-semibold text-Brown border-b border-gray-200 whitespace-nowrap text-sm">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {reportLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">Loading data...</td>
              </tr>
            ) : reportData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No reports found for selected filters.</td>
              </tr>
            ) : (
              reportData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 text-sm text-left transition-colors">
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200 font-medium whitespace-nowrap">{item.title}</td>
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200 capitalize whitespace-nowrap">{item.role}</td>
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200 whitespace-nowrap">
                    {item.estimatedCost > 0 ? `₦${item.estimatedCost.toLocaleString()}` : item.email}
                  </td>
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'success' || item.status === 'completed' || item.status === 'active' 
                        ? 'bg-green text-green-700' 
                        : item.status === 'failed' || item.status === 'overdue'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* 🔹 ANALYTICS CARDS */}
    <div className="mt-8 w-full overflow-x-auto">
      <h4 className="text-base sm:text-lg font-bold text-Brown mb-4">Analytics Overview</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-Elegant-Gold">
          <h5 className="text-sm text-gray-600">Total Records</h5>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{reportStats.total}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-Elegant-Gold">
          <h5 className="text-sm text-gray-600">New This Month</h5>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{reportStats.monthly}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-Elegant-Gold">
          <h5 className="text-sm text-gray-600">Pending / Active</h5>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{reportStats.pending}</p>
        </div>
      </div>
    </div>
  </section>
)}

{/* {activeSection === "Settings" && (
  <section className="p-6 bg-white rounded-lg shadow-md">
    <h3 className="text-2xl font-bold text-orangee mb-6">
      Settings
    </h3>
    <p className="text-gray-500 mb-8">
      Manage your profile, preferences, security, and notifications.
    </p>

    <div className="space-y-8">
     
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

      <div className="flex justify-end">
        <button 
          className="bg-orangee text-white px-6 py-3 rounded-md shadow hover:bg-orange-600 transition focus:outline-none focus:ring focus:ring-orangee focus:ring-opacity-50">
          Save Changes
        </button>
      </div>
    </div>
  </section>
)} */}

      </main>
    
    </div>
  );
};

export default AdminDashboard;
















