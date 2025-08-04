import React from "react";
import Nav from "./index/nav";
import Home from "./index/Home";
import SearchBar from "./index/components/Home/SearchBar";
import Event from "./index/Event";
import Register from "./index/Register";
import Login from "./index/Login";
import Photographerinfo from "./index/Photographerinfo";
import EventAll from "./index/components/Event/EventAll";
import PicLoad from "./index/components/Download/PicLoad";
import AppRoutes from "./routes/AppRoutes";

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
      {/* <Photographerinfo/> */}
    </div>
  );
};
export default App;
