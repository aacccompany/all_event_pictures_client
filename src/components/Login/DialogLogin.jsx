import { X, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import useAuthStore from "@/stores/auth-store";

const DialogLogin = ({ isOpen, onClose }) => {
  const actionLogin = useAuthStore((state) => state.actionLogin);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleRedirect = () => {
    navigate("/register");
    onClose();
  };

  const handleRedirectBuyer = () => {
    navigate("/register/user");
    onClose();
  };

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const authSubmit = async (e) => {
    e.preventDefault();
    try {
      await actionLogin(form);
      toast.success("Login successfully");
      navigate("/");
      onClose();
    } catch (error) {
      const msgError = error.response?.data?.detail || "Login failed";
      toast.warning(msgError);
      console.error(error);
    }
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

        <form onSubmit={authSubmit}>
          <div className="grid gap-4 py-4 mt-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                id="email"
                name="email"
                placeholder="user@email.com"
                autoFocus
                onChange={handleOnChange}
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
                className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter Your Password"
                onChange={handleOnChange}
              />
            </div>
            <div className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer">
              <div onClick={handleRedirectBuyer} className="mb-3">Create Account for your Photo</div>
              <div onClick={handleRedirect}>Create Account for Photographer</div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-2 p-3 rounded-md text-sm text-white bg-blue-700 hover:bg-blue-800"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default DialogLogin;
