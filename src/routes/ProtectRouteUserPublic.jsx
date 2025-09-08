import { currentAdmin, currentUserPublic } from "@/api/auth";
import Notfound from "@/pages/Notfound";
import useAuthStore from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const ProtectRouteUserPublic = ({ element }) => {
  const token = useAuthStore((state) => state.token);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  useEffect(() => {
    handleVerifyToken();
  }, []);

  const handleVerifyToken = async () => {
    try {
      await currentUserPublic(token);
      setIsAccessDenied(false);
    } catch (error) {
      setIsAccessDenied(true);
      console.log(error);
    }
  };

  if (isAccessDenied) {
    return <Notfound />;
  }

  return element;
};

export default ProtectRouteUserPublic;
