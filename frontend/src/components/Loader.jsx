// src/components/Loader.js
import React from "react";

const Loader = () => {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.2);
          border-left-color: #4f46e5; /* Adjust color here */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
