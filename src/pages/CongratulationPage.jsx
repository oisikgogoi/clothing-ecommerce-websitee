import React from "react";
import { useNavigate } from "react-router-dom";

const CongratulationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Congratulations!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for shopping with us. Your order has been placed successfully!
        </p>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CongratulationsPage;
