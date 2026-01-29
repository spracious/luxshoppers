import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TrackErrandsSection = () => {
  const navigate = useNavigate();
  const [errands, setErrands] = useState({ pending: [], completed: [] });
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchErrands = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Get user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (!currentUser?._id) {
        setError("User not logged in. Please log in again.");
        setLoading(false);
        return;
      }

      // ✅ Use MongoDB ObjectId for API
      const response = await axios.get(
        `https://errandgirlie-backend.onrender.com/api/v1/errands/${currentUser._id}`
      );

      if (response.data.errands) {
        const pending = response.data.errands.filter((e) => e.status === "pending");
        const completed = response.data.errands.filter((e) => e.status === "completed");
        setErrands({ pending, completed });
      }
    } catch (err) {
      console.error("Error fetching errands:", err);
      setError("Failed to load errands. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrands();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const currentErrands = errands[activeTab];
  const totalPages = Math.ceil(currentErrands.length / itemsPerPage);
  const paginatedErrands = currentErrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <div className="bg-white p-8 rounded-md shadow-lg max-w-6xl mx-auto">
      <h1 className="font-extrabold text-2xl text-Elegant-Gold">Track Your Errands</h1>
      <p className="text-lg text-gray-600 mt-3">
        Stay organized and on top of your responsibilities with a detailed overview of your pending and completed errands.
      </p>

      <div className="flex space-x-4 mt-6 border-b">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "pending" ? "text-Elegant-Gold border-b-2 border-Brown" : "text-Brown"}`}
          onClick={() => handleTabChange("pending")}
        >
          Pending Errands
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "completed" ? "text-Elegant-Gold border-b-2 border-Brown" : "text-Brown"}`}
          onClick={() => handleTabChange("completed")}
        >
          Completed Errands
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-gray-700">Loading errands...</p>
      ) : error ? (
        <p className="mt-6 text-red-500">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto mt-6">
            {paginatedErrands.length > 0 ? (
              <table className="min-w-full bg-gray-100 border border-gray-300 rounded-md shadow-md">
                <thead>
                  <tr className="bg-Elegant-Gold">
                    <th className="py-3 px-6 text-left text-Brown">Service</th>
                    <th className="py-3 px-6 text-left text-Brown">Errand</th>
                    <th className="py-3 px-6 text-left text-Brown">Location</th>
                    <th className="py-3 px-6 text-left text-Brown">Voucher</th>
                                        <th className="py-3 px-6 text-left text-Brown">Amount</th>
                    <th className="py-3 px-6 text-left text-Brown">Status</th>
                  </tr>
                </thead>
              <tbody>
        {paginatedErrands.map((errand) => (
          <tr key={errand._id} className="border-b hover:bg-gray-200">
            <td className="py-3 px-6">{errand.service}</td>
            <td className="py-3 px-6">{errand.errandDescription}</td>
            <td className="py-3 px-6">{errand.location}</td>
           <td className="py-3 px-6">
  {errand.voucher ? errand.voucher.category : "N/A"}
</td>
<td className="py-3 px-6">
  ₦{Number(errand.estimatedCost).toLocaleString()}
</td>


            <td className="py-3 px-6">{errand.status}</td>
          </tr>
        ))}
      </tbody>
              </table>
            ) : (
              <p className="text-red-500 mt-4">No errands available in this tab.</p>
            )}
          </div>

          {paginatedErrands.length > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
              >
                Prev
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <button
        className="mt-8 bg-Elegant-Gold text-white px-6 py-2 rounded-md hover:bg-Brown transition"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>
    </div>
  );
};

export default TrackErrandsSection;
