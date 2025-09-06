import React from "react";
import {
  IdCard,
  CloudUpload,
  Banknote,
  PencilRuler,
  UserRound,
} from "lucide-react";

const RegisCard = ({ handleOnChange, handleSubmit }) => {


  return (
    // Main container:
    // - On mobile (default): Use flex-col for vertical stacking, add padding and reduce gap.
    // - On large screens (lg): Switch to flex-row for a side-by-side layout.
    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 min-h-190 bg-grey-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* === Left Content Section === */}
      {/* Adjust text alignment and font sizes for different screens */}
      <div className="text-center lg:text-left lg:max-w-xl">
        {/* Responsive font size for the main heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
          Photographer Register
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
          Register as a photographer on EventPic to participate in official
          photography.
        </p>

        {/* Group features into a single container for better spacing and alignment */}
        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-1 lg:flex lg:flex-col lg:items-start lg:space-y-5">
          <FeatureItem
            icon={<IdCard className="h-8 w-8 text-blue-600" />}
            text="Official Free Pass"
          />
          <FeatureItem
            icon={<CloudUpload className="h-8 w-8 text-blue-600" />}
            text="Easy To Manage"
          />
          <FeatureItem
            icon={<Banknote className="h-8 w-8 text-blue-600" />}
            text="Make Money"
          />
          <FeatureItem
            icon={<PencilRuler className="h-8 w-8 text-blue-600" />}
            text="Enjoy with Dev Tools"
          />
        </div>
      </div>

      {/* === Right Form Section === */}
      {/* Set width and max-width to ensure the form looks good on all screen sizes */}
      <div className="w-full max-w-md lg:w-1/2 mt-12 lg:mt-0">
        {/* Form is styled as a card for better visual separation */}
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-6 bg-white p-8 rounded-xl shadow-lg"
        >
          {/* Form Header */}
          <div className="flex items-center gap-3">
            <UserRound className="h-7 w-7 text-blue-700" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Create Account
            </h2>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                onChange={handleOnChange}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleOnChange}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={handleOnChange}
              />
            </div>
          </div>
          <button
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            type="submit"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

// A helper component to avoid repeating the feature item structure
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    {icon}
    <h2 className="text-xl md:text-2xl font-semibold text-slate-800">{text}</h2>
  </div>
);

export default RegisCard;
