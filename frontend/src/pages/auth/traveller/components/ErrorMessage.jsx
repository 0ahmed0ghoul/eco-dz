import React from "react";
import { FaTimes } from "react-icons/fa";

const ErrorMessage = ({ error, onClose }) => {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FaTimes className="text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-500 hover:text-red-700">
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
