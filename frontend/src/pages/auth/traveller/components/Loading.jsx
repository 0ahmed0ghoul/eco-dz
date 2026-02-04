import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
