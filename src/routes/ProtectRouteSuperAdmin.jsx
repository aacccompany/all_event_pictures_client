import { currentSuperAdmin } from "@/api/auth";
import Notfound from "@/pages/Notfound";
import useAuthStore from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const ProtectRouteSuperAdmin = ({ element }) => {
  const token = useAuthStore((state) => state.token);
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    handleVerifyToken();
  }, []);

  const handleVerifyToken = async () => {
    try {
      await currentSuperAdmin(token);
      setIsAccessDenied(false);
    } catch (error) {
      setIsAccessDenied(true);
      const msg = error.response?.data?.detail || "Access Denied";
      setErrorMessage(msg);
      console.log(error);
    }
  };

  if (isAccessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          {errorMessage || "You do not have permission to view this page. Please make sure you are logged in with the correct account."}
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return element;
};

export default ProtectRouteSuperAdmin;
