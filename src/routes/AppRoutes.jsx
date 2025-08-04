import Cart from "@/index/Cart";
import PicLoad from "@/index/components/Download/PicLoad";
import Event from "@/index/Event";
import Home from "@/index/Home";
import Register from "@/index/Register";
import Layout from "@/layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Event />} />
          <Route path="/download" element={<PicLoad />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
