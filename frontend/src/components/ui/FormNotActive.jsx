import React from 'react'

const FormNotActive = () => {

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl text-red-500">⛔</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Form Not Active
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          This form is currently inactive or has been closed by the creator.
          You can’t submit responses at this moment.
        </p>

        {/* Optional info */}
        <div className="text-sm text-gray-500 mb-6">
          If you believe this is a mistake, please contact the form owner.
        </div>

        {/* Action */}
        <button
          onClick={() => navigate("/")}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}



export default FormNotActive
