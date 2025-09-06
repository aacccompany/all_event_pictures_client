import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import useAuthStore from "./stores/auth-store";

const App = () => {
  const checkToken = useAuthStore((state) => state.checkToken);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
  
  return (
    <div>
      <AppRoutes />
      <Toaster position="top-center" expand={false} richColors />
      {/* <Photographerinfo/> */}
    </div>
  );
};
export default App;
