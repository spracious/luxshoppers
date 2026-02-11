import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL } from "../constant";

const TrackErrandsSection = () => {
  const navigate = useNavigate();

  // ✅ Properly structured initial state
  const [errands, setErrands] = useState({
    pending: [],
    completed: [],
    "in-progress": [],
    overdue: [],
  });

  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchErrands = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (!currentUser || !currentUser._id) {
        setError("User not logged in. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${BASEURL}/errands/${currentUser._id}`
      );

      const errandsData = response?.data?.errands || [];

      const pending = errandsData.filter((e) => e.status === "pending");
      const completed = errandsData.filter((e) => e.status === "completed");
      const inProgress = errandsData.filter(
        (e) => e.status === "in-progress"
      );
      const overdue = errandsData.filter((e) => e.status === "overdue");

      setErrands({
        pending,
        completed,
        "in-progress": inProgress,
        overdue,
      });
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

  // ✅ Prevent crash if undefined
  const currentErrands = errands[activeTab] || [];
  const totalPages = Math.ceil(currentErrands.length / itemsPerPage);

  const paginatedErrands = currentErrands.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white p-8 rounded-md shadow-lg max-w-6xl mx-auto">
      <h1 className="font-extrabold text-2xl text-Elegant-Gold">
        Track Your Errands
      </h1>

      <p className="text-lg text-gray-600 mt-3">
        Stay organized and on top of your responsibilities with a detailed
        overview of your errands.
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mt-6 border-b">
        {["pending", "in-progress", "completed", "overdue"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-semibold ${
              activeTab === tab
                ? "text-Elegant-Gold border-b-2 border-Brown"
                : "text-Brown"
            }`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.replace("-", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
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
                  <tr className="bg-Elegant-Gold m-auto">
                    <th className="py-3 px-6 text-centre text-Brown">
                      Service
                    </th>
                    <th className="py-3 px-6 text-centre text-Brown">
                      Description
                    </th>
                    <th className="py-3 px-6 text-centre text-Brown">
                      Location
                    </th>
                    <th className="py-3 px-6 text-centre text-Brown">
                      Voucher
                    </th>
                    <th className="py-3 px-6 text-centre text-Brown">
                      Amount
                    </th>
                    <th className="py-3 px-6 text-centre text-Brown">
                      Due Date
                    </th>
                    {/* <th className="py-3 px-6 text-left text-Brown">
                      Status
                    </th> */}
                  </tr>
                </thead>

                <tbody>
                  {paginatedErrands.map((errand) => (
                    <tr
                      key={errand._id}
                      className="border-b hover:bg-gray-200"
                    >
                      <td className="py-3 px-6">
                        {errand.service || "N/A"}
                      </td>
                      <td className="py-3 px-6">
                        {errand.errandDescription || "N/A"}
                      </td>
                      <td className="py-3 px-6">
                        {errand.location || "N/A"}
                      </td>
                      <td className="py-3 px-6">
                        {errand.voucher?.category || "N/A"}
                      </td>
                      <td className="py-3 px-6">
                        ₦
                        {errand.estimatedCost
                          ? Number(errand.estimatedCost).toLocaleString()
                          : "0"}
                      </td>
                      <td className="py-3 px-6">
                        {errand.dueDate
                          ? new Date(
                              errand.dueDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      {/* <td className="py-3 px-6 capitalize">
                        {errand.status}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 mt-4">
                No errands available in this tab.
              </p>
            )}
          </div>

          {/* Pagination */}
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
                Page {currentPage} of {totalPages || 1}
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
