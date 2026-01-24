import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import services from "../../db.json"; 

const DELIVERY_CHARGES = {
  Abuja: 4000,
  Lagos: 3500,
  "Other Locations": 5000,
};

const parsePrice = (price) => {

  return Number(price.replace(/[^0-9]/g, ""));
};


const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  
  const userName = parsedUser.name || "Valued Customer";
  const customer =  {
    email: parsedUser.email || "",
    phone: parsedUser.phone || ""
  };

// const customer =  JSON.parse(localStorage.getItem("user") || "{}")
  const [selectedService, setSelectedService] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
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
    const voucherCost = selectedVoucher
      ? parsePrice(selectedVoucher.price)
      : customAmount
      ? Number(customAmount)
      : 0;
  
    const deliveryCharge = DELIVERY_CHARGES[customerDetails.location] || 0;
    const serviceCharge = voucherCost * 0.10;
  
    const total = voucherCost + serviceCharge + deliveryCharge;
    setTotalCost(total);
  };


  
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSelectedItems([]);
    setStep(2);
  };

  const handleVoucherSelect = (voucherId) => {
    const voucher = selectedService.inventory.find((item) => item.id === voucherId);
    setSelectedVoucher(voucher);
  };  
  
  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    // setCustomAmount(value >= 150000 ? value : "");
  };

      const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  

  const handlePay = () => {
    calculateTotal();
    setIsModalOpen(true);
  };

  
// T508235738621212

 const handlePayWithPaystack = (amount, email, phoneNumber, onSuccess, onFailure) => {
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  const handler = window.PaystackPop.setup({
    key: paystackPublicKey, 
    email: email,
    amount: parseInt(amount, 10) * 100, 
    currency: "NGN",
    phone: phoneNumber,
    channels: ["card", "bank", "ussd"], 
    callback: function (response) {
      console.log("Paystack Response:", response);
      alert(`Payment Successful! Reference: ${response.reference}`);
      onSuccess(response);
    },
    onClose: function () {
      alert("Payment was not completed");
      onFailure();
    },
  });
  handler.openIframe();
};


  /* ---------------- SAVE TO BACKEND ---------------- */
  const saveOrderToBackend = async (reference) => {
    try {
    const payload = {
  user: {
    name: userName,
    email: customerDetails.email,
    phone: customerDetails.phoneNumber,
    address: customerDetails.address,
    location: customerDetails.location,
    errandDescription: customerDetails.description,
  },
     service: selectedService
        ? {
            id: selectedService.id,
            name: selectedService.name,
            // items: selectedItems, // optional array of items user selected
          }
        : null,
      voucher: selectedVoucher
        ? {
            id: selectedVoucher.id,
            name: selectedVoucher.name,
        // price: Number(selectedVoucher.price), // <--- convert to number
      }
    : { name: "Custom Amount", price: Number(customAmount) }, // <--- convert to number
  amount: Number(totalCost), // <--- convert to number
  status: "success",
  transactionId: reference,
  paymentMethod: "Paystack",
};


      await axios.post(
        "https://errandgirlie-backend.onrender.com/api/v1/payments/generate",
        payload
      );

      alert("Payment successful & order recieved!");
      setIsModalOpen(false);
      setStep(1);
     navigate("/errands"); // ✅ Navigate to errands page 
    } catch (err) {
      console.error(err);
      alert("Payment successful but saving failed");
    }
  };

const handleConfirmPayment = () => {
  if (!totalCost) {
    alert("Invalid amount");
    return;
  }

  const email = customerDetails?.email || "test@example.com";
  const phoneNumber = customerDetails?.phoneNumber || "08012345678";

  handlePayWithPaystack(
    totalCost,
    email,
    phoneNumber,
    (response) => {
      saveOrderToBackend(response.reference);
    },
    () => {
      alert("Payment not completed.");
    }
  );
};



// ... imports and other code ...

//   const saveOrderToBackend = async (reference) => {
//     try {
//       // 1. Construct the payload to match your backend's expectation
//       const payload = {
//         user: {
//           name: userName, // From localStorage
//           email: customerDetails.email,
//           phone: customerDetails.phoneNumber,
//           address: customerDetails.address,
//           location: customerDetails.location,
//           errandDescription: customerDetails.description, // Storing the errand here
//         },
//         voucher: selectedVoucher
//           ? {
//               id: selectedVoucher.id,
//               name: selectedVoucher.name,
//               price: selectedVoucher.price,
//             }
//           : { name: "Custom Amount", price: customAmount },
//         amount: totalCost,
//         status: "success", // We mark as success because Paystack verified it
//         transactionId: reference, // The Paystack Reference
//         paymentMethod: "Paystack",
//       };

//       console.log("Sending Payload:", payload);

//       // 2. Send to your specific endpoint (/api/payment/generate)
//       const response = await axios.post(
//   `http://localhost:10000/api/v1/payments/generate`,
//   payload
// );


//       if (response.status === 201) {
//         alert("Payment Successful & Order Saved!");
//         setIsModalOpen(false);
//         setStep(1); // Reset to home
//       }
//     } catch (error) {
//       console.error("Error saving order:", error);
//       alert("Payment successful, but failed to save to database.");
//     }
//   };

  // ... rest of the component (handlePayWithPaystack, etc.) ...

  
  


  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <header className="bg-green-800 text-green p-6 flex justify-between items-center shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
       <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-white px-2 py-2 rounded hover:bg-gray-600"
                >
                  ⬅
                </button>

  
  <p className="text-1xl font-semibold text-Elegant-Gold">
    You are almost there <span className="text-Brown font-bold">{userName}!</span>
  </p>
</header>

<main className="container mx-auto p-6 flex-grow">
  {step === 1 && (
    <section>
      <h2 className="text-3xl text-Elegant-Gold mb-10 font-bold text-center tracking-wide">
        Please select your choice service
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
          Select Items
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

              <form className="mt-6 space-y-4">
              <div>
  <label htmlFor="cartId" className="block text-gray-700 font-bold">
    Select Voucher
  </label>
  <select
    id="cartId"
    name="cartId"
    value={selectedVoucher?.id || "unlimited"}
    onChange={(e) => {
      const selectedId = e.target.value;
      if (selectedId === "unlimited") {
        setSelectedVoucher(null);
        setCustomAmount("");
      } else {
        handleVoucherSelect(selectedId);
      }
    }}
    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700"
  >
    <option value="" disabled>
      Pick a Voucher
    </option>
    {selectedService.inventory.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name} - {item.price}
      </option>
    ))}
    <option value="unlimited">Unlimited (₦150,000+)</option>
  </select>
</div>

{selectedVoucher === null && (
  <div className="mt-4">
    <label htmlFor="customAmount" className="block text-gray-700 font-bold">
      Enter Amount (₦150,000 and above)
    </label>
    <input
      id="customAmount"
      type="number"
      min="150000"
      value={customAmount}
      onChange={handleCustomAmountChange}
      placeholder="Enter your preferred amount"
      className="w-full p-2 border border-gray-300 rounded-lg"
    />
    {customAmount < 150000 && customAmount !== "" && (
      <p className="text-red-600 text-sm mt-2">
        Amount must be ₦150,000 or more.
      </p>
    )}
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
    ? parsePrice(selectedVoucher.price).toLocaleString()
    : customAmount
    ? Number(customAmount).toLocaleString()
    : "0"}
</p>

      
<p>
  <strong>Service Charge (10%):</strong> ₦
  {selectedVoucher
    ? (parsePrice(selectedVoucher.price) * 0.10).toLocaleString()
    : customAmount
    ? (Number(customAmount) * 0.10).toLocaleString()
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
