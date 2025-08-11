
import { currentAdmin } from "@/api/auth";
import useAuthStore from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const ProtectRouteAdmin = ({ element }) => {
  const token = useAuthStore((state) => state.token);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  useEffect(() => {
    handleVerifyToken();
  }, []);

  const handleVerifyToken = async () => {
    try {
      await currentAdmin(token);
      setIsAccessDenied(false);
    } catch (error) {
      setIsAccessDenied(true);
      console.log(error);
    }
  };

  if (isAccessDenied) {
    return (
      <div className="capitalize flex w-screen h-screen items-center justify-center">
        <p>
          Access denied! Go to <Link to="/">home</Link>
        </p>
      </div>
    );
  }

  return element;
};

export default ProtectRouteAdmin;
