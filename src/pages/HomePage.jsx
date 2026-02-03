import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import services from "../../db.json"; 

const DELIVERY_CHARGES = {
  Abuja: 3000,
  Lagos: 5000,
  Minna: 3500,
  Kaduna: 4000,
  Kano: 4500,
  Nassarawa: 3500,
  "Other Locations": 5000,
};

const parseAmount = (amount) => Number(amount || 0);


const HomePage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const userName = currentUser.name || "Valued Customer";
  const customer =  {
    email: currentUser.email || "",
    phone: currentUser.phone || "",
  };

  const [selectedService, setSelectedService] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
   const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 
    const [customerDetails, setCustomerDetails] = useState({
    address: "",
    email:customer.email,
    phoneNumber: customer.phone,
    location: "Abuja", 
    description: "",
  });

const calculateTotal = () => {
  const voucherCost = getVoucherCost();

  const deliveryCharge = DELIVERY_CHARGES[customerDetails.location] || 0;
  const serviceCharge = voucherCost * 0.1;

  const total = voucherCost + serviceCharge + deliveryCharge;

  setTotalCost(total);
};

useEffect(() => {
  calculateTotal();
}, [selectedVoucher, customAmount]);

  
  // 🔹 Fetch vouchers from backend
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get(
          "https://errandgirlie-backend.onrender.com/api/v1/vouchers"
        );
        setVouchers(res.data);
        // console.log("vouchers")
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const getVoucherCost = () => {
  if (!selectedVoucher) return Number(customAmount) || 0;

  if (selectedVoucher.isUnlimited) {
    return Number(customAmount) || 0;
  }

  return Number(selectedVoucher.amount) || 0;
};


 
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedVoucher(null);
    setSelectedItems([]);
    setStep(2);
  };

const handleVoucherSelect = (voucherId) => {
  const voucher = vouchers.find((v) => v._id === voucherId) || null;
  setSelectedVoucher(voucher);
  setCustomAmount(""); // reset when changing voucher
  console.log("Selected Voucher:", voucher);
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

  
// T508235738621212

const handlePayWithPaystack = (
  amount,
  email,
  phoneNumber,
  onSuccess,
  onFailure
) => {
  if (!window.PaystackPop) {
    alert("Payment service not loaded. Please refresh the page.");
    return;
  }

  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    // const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    // const paystackPublicKey = import.meta.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;


  const handler = window.PaystackPop.setup({
    key: paystackPublicKey,
    email,
    amount: Math.round(amount * 100),
    currency: "NGN",
    phone: phoneNumber,
    channels: ["card", "bank", "ussd"],
    callback: function (response) {
      console.log("Paystack Response:", response);
      onSuccess(response);
    },
    onClose: function () {
      onFailure();
    },
  });

  handler.openIframe();
};



  /* ---------------- SAVE TO BACKEND ---------------- */
const saveOrderToBackend = async (paymentReference) => {
  try {
    // ✅ Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser._id) throw new Error("User not logged in!");

    // 1️⃣ Create errand payload
    const errandPayload = {
      user: currentUser._id, // Use currentUser instead of undefined "user"
      service: selectedService?.name || "Custom Service",
      voucher: selectedVoucher?._id || null,
      errandDescription: customerDetails.description || "N/A",
      location: customerDetails.location,
      phone: customerDetails.phoneNumber,
      address: customerDetails.address,
      estimatedCost: totalCost,
      paymentReference, // Pass Paystack reference here
    };

    // 2️⃣ Save errand to backend
    const errandResponse = await axios.post(
      "https://errandgirlie-backend.onrender.com/api/v1/errands/send",
      errandPayload
    );

    const errandId = errandResponse.data.errand._id;

    // 3️⃣ Create payment payload
  
  const paymentPayload = {
  user: currentUser._id,  // ObjectId string, not object
  errand: errandId,        // ObjectId string
  service: { name: selectedService?.name || "Custom Service" },
  voucher: selectedVoucher?._id || null, // only the voucher ID
  amount: Number(totalCost) || 0,
  status: "success",
  transactionId: paymentReference,
  paymentMethod: "Paystack",
};


    console.log("Payment Payload to Backend:", paymentPayload);


    // 4️⃣ Save payment to backend
    await axios.post(
      "https://errandgirlie-backend.onrender.com/api/v1/payments/generate",
      paymentPayload
    );

    // 5️⃣ Update UI
    alert("Payment successful & order received!");
    setIsModalOpen(false);
    setStep(1);
    navigate("/errands");
  } catch (err) {
    console.error("Error saving order:", err);
    alert(
      "Payment successful but saving order failed. Please contact support."
    );
  }
};


const handleConfirmPayment = () => {
  if (selectedVoucher?.isUnlimited) {
    if (!customAmount || customAmount < selectedVoucher.minAmount) {
      alert(
        `Amount must be ₦${selectedVoucher.minAmount.toLocaleString()} or more`
      );
      return;
    }
  }

  if (!totalCost) {
    alert("Invalid payment amount");
    return;
  }

  const email = customerDetails?.email || "test@example.com";
  const phoneNumber = customerDetails?.phoneNumber || "08012345678";

   handlePayWithPaystack(
    totalCost,
    customerDetails.email,
    customerDetails.phoneNumber,
    (response) => saveOrderToBackend(response.reference),
    () => alert("Payment cancelled")
  );
};


  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <header className="bg-green-800 text-green p-6 flex justify-between items-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
    <Link
                to="/dashboard">
       <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-white px-2 py-2 rounded hover:bg-gray-600"
                >
                  ⬅
                </button>
     </Link>

  
  <p className="text-1xl font-semibold text-Elegant-Gold">
    You are almost there <span className="text-Brown font-bold">{userName}!</span>
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
        <h3 className="text-2xl font-extrabold text-Elegant-Gold mb-4">{service.name}</h3>
        <p className="text-Brown text-lg leading-relaxed mb-6">{service.description}</p>
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
        {!voucher.isUnlimited && ` – ₦${voucher.amount.toLocaleString()}`}
        {voucher.isUnlimited && " - ₦150,000 and above"}
      </option>
    ))}
  </select>
</div>

{/* Unlimited voucher input */}
{selectedVoucher?.isUnlimited && (
  <div className="mt-4">
    <label className="font-bold">
      Enter Amount (₦{selectedVoucher.minAmount.toLocaleString()}+)
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
    <label htmlFor="address" className="block text-gray-700 font-bold">
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
  <label htmlFor="phoneNumber" className="block text-gray-700 font-bold">
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
  {customerDetails.phoneNumber.length > 0 && customerDetails.phoneNumber.length !== 11 && (
    <p className="text-red-600 text-sm mt-2">
      Phone number must be exactly 11 digits.
    </p>
  )}
</div>

  <div>
    <label htmlFor="location" className="block text-gray-700 font-bold">
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
    <label htmlFor="description" className="block text-gray-700 font-bold">
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

      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-300 bg-opacity-50 text-green flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-4">Payment Details</h2>
      
 <p>
  <strong>Voucher Amount:</strong> ₦
  {selectedVoucher
    ? selectedVoucher.amount
    : customAmount
    ? Number(customAmount)
    : "0"}
</p>

<p>
  <strong>Service Charge (10%):</strong> ₦
  {selectedVoucher
    ? (selectedVoucher.amount * 0.1)
    : customAmount
    ? (Number(customAmount) * 0.1)
    : "0"}
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


     <footer className="bg-Brown text-Elegant-Gold font-bold py-6 mt-auto text-center">
        <p>&copy; {new Date().getFullYear()} LuxShoppers. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
