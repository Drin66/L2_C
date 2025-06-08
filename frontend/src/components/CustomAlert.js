import React from 'react';

const CustomAlert = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  const handleLogin = () => {
    const loginButton = document.querySelector('button[onClick*="setShowLoginForm"]');
    if (loginButton) {
      loginButton.click();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 relative z-10 transform transition-all ease-in-out duration-300 scale-100">
        <div className="flex flex-col items-center">
          <div className="mb-4 p-2 rounded-full bg-red-100">
            <svg 
              className="w-6 h-6 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white bg-red-500 px-4 py-1 rounded-md mb-2">Authentication Required</h3>
          <p className="text-gray-600 text-center mb-6">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              Close
            </button>
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert; 