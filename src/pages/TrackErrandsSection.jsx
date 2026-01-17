import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrackErrandsSection = () => {
  const navigate = useNavigate();

 
  const [errands, setErrands] = useState({
    pending: [
      {
        id: 1,
        title: "Fruits & Vegetables",
        description: "1 basket of Tomatoes, Half basket of pepper, 10 cucumbers, 4 cabbages, 5 big tin of sweet corn.",
        assignedTo: "Number 5",
        assignedTeam: "Event Planning Team",
        priority: "High",
        location: "Hilton Conference Center, Abuja",
        estimatedCost: "Silver",
        dueDate: "2024-12-22",
      },
      {
        id: 2,
        title: "Local Market Treasures",
        description: "Half bag of foreign rice, 5 mudus of beans, 1 painter of crayfish, 5 tubbers of yam, 1 basket of irish potatoes, 1 big bunch of ripe plaintains.",
        assignedTo: "Number 2",
        assignedTeam: "Procurement Team",
        priority: "Medium",
        location: "New Head Office, Maitama",
        estimatedCost: "Diamond",
        dueDate: "2024-12-30",
      },
      {
        id: 3,
        title: "Grocery Shopping",
        description: "5 medium blue-band, 1 roll of tissue, 3 packs of 5alive 1L, 10 packs of elim bottle water 50cl.",
        assignedTo: "Number 7",
        assignedTeam: "Travel Management Team",
        priority: "High",
        location: "Abuja International Airport",
        estimatedCost: "Unlimited",
        dueDate: "2024-12-18",
      },
    ],
    completed: [
        {
          id: 1,
          title: "Fruits & Vegetables",
          description: "1 basket of Tomatoes, Half basket of pepper, 10 cucumbers, 4 cabbages, 5 big tin of sweet corn.",
          assignedTo: "Number 5",
          assignedTeam: "Event Planning Team",
          priority: "High",
          location: "Hilton Conference Center, Abuja",
          estimatedCost: "Silver",
          dueDate: "2024-12-22",
        },
        {
          id: 2,
          title: "Local Market Treasures",
          description: "Half bag of foreign rice, 5 mudus of beans, 1 painter of crayfish, 5 tubbers of yam, 1 basket of irish potatoes, 1 big bunch of ripe plaintains.",
          assignedTo: "Number 2",
          assignedTeam: "Procurement Team",
          priority: "Medium",
          location: "New Head Office, Maitama",
          estimatedCost: "Diamond",
          dueDate: "2024-12-30",
        },
        {
          id: 3,
          title: "Grocery Shopping",
          description: "5 medium blue-band, 1 roll of tissue, 3 packs of 5alive 1L, 10 packs of elim bottle water 50cl.",
          assignedTo: "Number 7",
          assignedTeam: "Travel Management Team",
          priority: "High",
          location: "Abuja International Airport",
          estimatedCost: "Unlimited",
          dueDate: "2024-12-18",
        },
      ],
  });


  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

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
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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

      <div className="overflow-x-auto mt-6">
        {paginatedErrands.length > 0 ? (
          <table className="min-w-full bg-gray-100 border border-gray-300 rounded-md shadow-md">
            <thead>
              <tr className="bg-Elegant-Gold">
                <th className="py-3 px-6 text-left text-Brown">Services</th>
                <th className="py-3 px-6 text-left text-Brown">Errands</th>
                <th className="py-3 px-6 text-left text-Brown">Agent</th>
                <th className="py-3 px-6 text-left text-Brown">Location</th>
                <th className="py-3 px-6 text-left text-Brown">Voucher</th>
              </tr>
            </thead>
            <tbody>
              {paginatedErrands.map((errand) => (
                <tr key={errand.id} className="border-b hover:bg-gray-200">
                  <td className="py-3 px-6">{errand.title}</td>
                  <td className="py-3 px-6">{errand.description}</td>
                  <td className="py-3 px-6">{errand.assignedTo}</td>
                  <td className="py-3 px-6">{errand.location}</td>
                  <td className="py-3 px-6">{errand.estimatedCost || "N/A"}</td>
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









