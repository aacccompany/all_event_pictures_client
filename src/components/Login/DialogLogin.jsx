import { Link } from "react-router";
import { X, UserRound } from "lucide-react";
import { useNavigate } from "react-router";

const DialogLogin = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRedirect = () => {
    navigate("/register");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-white/30 backdrop-blur-lg z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <UserRound className="h-7 w-7 text-blue-700" />
          <h2 className="text-xl font-bold text-gray-800">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <div className="grid gap-4 py-4 mt-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="user@email.com"
              className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter Your Password"
              className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
            <div className="mb-3">Forgot your password?</div>
            <div onClick={handleRedirect}>Don't have an account?</div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-2 p-3 rounded-md text-sm text-white bg-blue-700 hover:bg-blue-800"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default DialogLogin;
