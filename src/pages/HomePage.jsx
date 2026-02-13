import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import services from "../../db.json";
import { BASEURL } from "../constant";

const DELIVERY_CHARGES = {
  Abuja: 3000,
  Lagos: 5000,
  Minna: 3500,
  Kaduna: 4000,
  Kano: 4500,
  Nassarawa: 3500,
  "Other Locations": 5000,
};

const HomePage = () => {
  const navigate = useNavigate();

  // Safe User Parsing
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : {};
  const userName = currentUser.name || "Valued Customer";

  const customer = {
    email: currentUser.email || "",
    phone: currentUser.phone || "",
  };

  const [selectedService, setSelectedService] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Popup Message State
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [customerDetails, setCustomerDetails] = useState({
    address: "",
    email: customer.email,
    phoneNumber: customer.phone,
    location: "Abuja",
    description: "",
  });

  const showPopup = (message, type = "error") => {
    setPopup({ show: true, message, type });
    if (type === "success") {
      setTimeout(() => {
        setPopup({ ...popup, show: false });
      }, 3000);
    }
  };

  // ✅ HELPER: Centralized logic to get the actual amount currently being used
  const getCurrentAmount = () => {
    if (!selectedVoucher) return Number(customAmount) || 0;
    if (selectedVoucher.isUnlimited) return Number(customAmount) || 0;
    return Number(selectedVoucher.amount) || 0;
  };

  const calculateTotal = () => {
    const voucherCost = getCurrentAmount(); // Use helper
    const deliveryCharge = DELIVERY_CHARGES[customerDetails.location] || 0;
    const serviceCharge = voucherCost * 0.1;
    const total = voucherCost + serviceCharge + deliveryCharge;
    setTotalCost(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [selectedVoucher, customAmount, customerDetails.location]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get(
          "https://errandgirlie-backend.onrender.com/api/v1/vouchers"
        );
        setVouchers(res.data);
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedVoucher(null);
    setStep(2);
  };

  const handleVoucherSelect = (voucherId) => {
    const voucher = vouchers.find((v) => v._id === voucherId) || null;
    setSelectedVoucher(voucher);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value === "" ? "" : Number(value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePay = () => {
    setIsModalOpen(true);
  };

  const handlePayWithPaystack = (
    amount,
    email,
    phoneNumber,
    onSuccess,
    onFailure
  ) => {
    if (!window.PaystackPop) {
      showPopup("Payment service not loaded. Please refresh the page.", "error");
      return;
    }

    const paystackPublicKey =
      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
      "pk_test_d3e946b0ab3d7143559ced6c9487414648df75a5";

    const handler = window.PaystackPop.setup({
      key: paystackPublicKey,
      email,
      amount: Math.round(amount * 100),
      currency: "NGN",
      phone: phoneNumber,
      channels: ["card", "bank", "ussd"],
      callback: function (response) {
        onSuccess(response);
      },
      onClose: function () {
        onFailure();
      },
    });

    handler.openIframe();
  };

  const saveOrderToBackend = async (paymentReference) => {
    try {
      if (!currentUser._id) throw new Error("User not logged in");

      const errandPayload = {
        user: currentUser._id,
        service: selectedService?.name || "Custom Service",
        errandDescription: customerDetails.description || "N/A",
        location: customerDetails.location,
        phone: customerDetails.phoneNumber,
        address: customerDetails.address,
        estimatedCost: Number(totalCost),
        dueDate: dueDate,
        paymentReference,
      };

      if (selectedVoucher?._id) {
        errandPayload.voucher = selectedVoucher._id;
      }

      const errandResponse = await axios.post(
        `${BASEURL}/errands/send`,
        errandPayload
      );

      const errandId = errandResponse.data.errand._id;

      const paymentPayload = {
        user: currentUser._id,
        errand: errandId,
        service: { name: selectedService?.name || "Custom Service" },
        amount: Number(totalCost),
        status: "pending",
        transactionId: paymentReference,
        paymentMethod: "Paystack",
      };

      if (selectedVoucher?._id) {
        paymentPayload.voucher = selectedVoucher._id;
      }

      await axios.post(`${BASEURL}/payments/generate`, paymentPayload);

      showPopup("Payment successful & order received!", "success");
      setIsModalOpen(false);

      setTimeout(() => {
        setStep(1);
        navigate("/errands");
      }, 2000);
    } catch (err) {
      console.error("Error saving order:", err);
      showPopup(
        "Payment successful but saving order failed. Please contact support.",
        "error"
      );
    }
  };

  const handleConfirmPayment = () => {
    const currentAmount = getCurrentAmount(); // use helper

    if (selectedVoucher?.isUnlimited) {
      if (!currentAmount || currentAmount < selectedVoucher.minAmount) {
        showPopup(
          `Amount must be ₦${selectedVoucher.minAmount.toLocaleString()} or more`,
          "error"
        );
        return;
      }
    }

    if (!totalCost) {
      showPopup("Invalid payment amount", "error");
      return;
    }

    handlePayWithPaystack(
      totalCost,
      customerDetails.email,
      customerDetails.phoneNumber,
      (response) => saveOrderToBackend(response.reference),
      () => showPopup("Payment cancelled", "error")
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <header className="bg-green-800 text-green p-6 flex justify-between items-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
        <Link to="/dashboard">
          <button
            onClick={() => setStep(1)}
            className="bg-gray-200 text-white px-2 py-2 rounded hover:bg-gray-600"
          >
            ⬅
          </button>
        </Link>

        <p className="text-1xl font-semibold text-Elegant-Gold">
          You are almost there{" "}
          <span className="text-Brown font-bold">{userName}!</span>
        </p>
      </header>

      <main className="container mx-auto p-6 flex-grow">
        {step === 1 && (
          <section>
            <h2 className="text-3xl text-Elegant-Gold mb-10 font-bold text-center tracking-wide">
              Please select your intend service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.services.map((service) => (
                <div
                  key={service.id}
                  className="p-8 rounded-lg shadow-lg bg-gray-100 transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out"
                  style={{
                    backgroundImage: `url(${service.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="bg-opacity-100 p-6 rounded-lg">
                    <h3 className="text-2xl font-extrabold text-Elegant-Gold mb-4">
                      {service.name}
                    </h3>
                    <p className="text-Brown text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <button
                      onClick={() => handleServiceSelect(service)}
                      className="bg-Elegant-Gold text-white font-semibold px-6 py-3 rounded-lg hover:bg-Brown transition duration-300"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 2 && selectedService && (
          <section>
            <h1 className="text-2xl mb-8 font-bold text-Elegant-Gold">
              {selectedService.name}
            </h1>
            <div className="bg-gray-50 text-Brown p-6 rounded-lg shadow-md max-w-lg mx-auto">
              <h2 className="font-bold text-center mb-6">
                Select voucher card category for {selectedService.name}
              </h2>
              <div>
                {selectedService.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <span className="text-xl">{item.name}</span>
                    <span className="text-bold text-orangee text-xl">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <form className="mt-6 py-4 space-y-4">
                {/* Voucher Selection */}
                <div>
                  <label className="block py-4 font-bold text-gray-700">
                    Select Voucher
                  </label>

                  <select
                    value={selectedVoucher?._id || ""}
                    onChange={(e) => handleVoucherSelect(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a Voucher</option>

                    {vouchers.map((voucher) => (
                      <option key={voucher._id} value={voucher._id}>
                        {voucher.category}{" "}
                        {!voucher.isUnlimited &&
                          ` – ₦${voucher.amount.toLocaleString()}`}
                        {voucher.isUnlimited && " - ₦150,000 and above"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unlimited voucher input */}
                {selectedVoucher?.isUnlimited && (
                  <div className="mt-4">
                    <label className="font-bold">
                      Enter Amount (₦{selectedVoucher.minAmount.toLocaleString()}
                      +)
                    </label>
                    <input
                      type="number"
                      min={selectedVoucher.minAmount}
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 font-bold"
                  >
                    Delivery Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={customerDetails.address}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your detailed address"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 font-bold"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={customerDetails.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,11}$/.test(value)) {
                        setCustomerDetails((prevDetails) => ({
                          ...prevDetails,
                          phoneNumber: value,
                        }));
                      }
                    }}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your phone number"
                  />
                  {customerDetails.phoneNumber.length > 0 &&
                    customerDetails.phoneNumber.length !== 11 && (
                      <p className="text-red-600 text-sm mt-2">
                        Phone number must be exactly 11 digits.
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-gray-700 font-bold"
                  >
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={customerDetails.location}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {Object.keys(DELIVERY_CHARGES).map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-bold"
                  >
                    Errand Info
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={customerDetails.description}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter errand details on your scale of preferrence"
                  />
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-gray-700 font-bold"
                  >
                    Expected Delievry Date
                  </label>
                  <input
                    id="date"
                    name="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </form>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="bg-Brown text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handlePay}
                  className="bg-Elegant-Gold text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Checkout
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 🔹 PAYMENT SUMMARY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 text-green flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">
              Payment Details
            </h2>

            {/* ✅ FIXED: Use getCurrentAmount() to show correct price for unlimited vouchers */}
            <p>
              <strong>Voucher Amount:</strong> ₦
              {getCurrentAmount().toLocaleString()}
            </p>

            <p>
              <strong>Service Charge (10%):</strong> ₦
              {(getCurrentAmount() * 0.1).toLocaleString()}
            </p>

            <p>
              <strong>Delivery Charge:</strong> ₦
              {DELIVERY_CHARGES[customerDetails.location].toLocaleString()}
            </p>

            <hr className="my-4" />

            <p className="text-xl font-bold">
              <strong>Total:</strong> ₦{totalCost.toLocaleString()}
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-Brown text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="bg-Elegant-Gold text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 NEW: MESSAGE POPUP MODAL */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-80 transform transition-all scale-105">
            <div className="mb-4">
              {popup.type === "success" ? (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <span className="text-2xl text-green-600">✓</span>
                </div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <span className="text-2xl text-red-600">!</span>
                </div>
              )}
            </div>

            <h3
              className={`text-xl font-bold mb-2 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "Success!" : "Error"}
            </h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>

            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition duration-300 ${
                popup.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;