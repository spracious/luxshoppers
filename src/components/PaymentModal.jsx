import { useEffect, useState } from 'react';

const PaymentModal = ({
    selectedVoucher,
    customerDetails,
    DELIVERY_CHARGES,
    isModalOpen,
    setIsModalOpen,
    handleConfirmPayment,
    totalCost,
  }) => {
    useEffect(() => {
      if (selectedVoucher && customerDetails.location && DELIVERY_CHARGES[customerDetails.location]) {
        const voucherAmount = parsePrice(selectedVoucher.price);
        const serviceCharge = voucherAmount * 0.05;
        const deliveryCharge = DELIVERY_CHARGES[customerDetails.location];
  
        console.log('Voucher Amount:', voucherAmount);
        console.log('Service Charge:', serviceCharge);
        console.log('Delivery Charge:', deliveryCharge);
      }
    }, [selectedVoucher, customerDetails.location, DELIVERY_CHARGES]);
  
    return (
      isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Payment Details</h2>
  
            {/* Render values only if they're available */}
            {totalCost > 0 ? (
              <>
                <p><strong>Voucher Amount:</strong> ₦{totalCost}</p>
                {/* Add other details here */}
              </>
            ) : (
              <p>Loading...</p>
            )}
  
            <hr className="my-4" />
  
            <p className="text-xl font-bold">
              <strong>Total:</strong> ₦{totalCost.toLocaleString()}
            </p>
  
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )
    );
  };
  