import Cart from "@/pages/Cart";
import Download from "@/pages/Download";
import Event from "@/pages/Event";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Layout from "@/layouts/Layout";
import ViewEvent from "@/pages/ViewEvent";
import { BrowserRouter, Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Event />} />
          <Route path="/download" element={<Download />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/view-event" element={<ViewEvent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
