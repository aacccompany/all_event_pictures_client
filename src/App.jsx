import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      {/* <Nav />  */}
      {/* <SearchBar /> */}
      {/* <Home /> */}
      {/* <Event/> */}
      {/* <PicLoad/> */}
      {/* <Register /> */}
      {/* <Cart/> */}
      <AppRoutes />
      <Toaster position="top-center" expand={false} richColors />
      {/* <Photographerinfo/> */}
    </div>
  );
};
export default App;
