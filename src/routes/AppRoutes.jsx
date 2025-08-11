import Cart from "@/pages/Cart";
import Download from "@/pages/Download";
import Event from "@/pages/Event";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Layout from "@/layouts/Layout";
import { BrowserRouter, Routes, Route } from "react-router";
import Notfound from "@/pages/Notfound";
import ProtectRouteUser from "./ProtectRouteUser";
import Photographerinfo from "@/pages/Photographerinfo";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import DashBoardContainer from "@/components/Dashboard/DashBoardContainer";
import EventCreateContainer from "@/components/Event/EventCreateContainer";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*  Public User*/}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Event />} />
          <Route path="/download" element={<Download />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/event-detail/:id" element={<EventView />} />
          <Route path="/events/event-detail/:id" element={<EventView />} />
        </Route>

        {/* Private User */}
        {/* <Route path="user" element={<PrtectRouteUser element={<Layout />} />}>
          <Route path="photographForm" element={<Photographerinfo />} />
          <Route path="dashboard" element={<DashBoardContainer />} />
        </Route> */}

          <Route path="user" element={<Layout />}>
          <Route path="photographForm" element={<Photographerinfo />} />
          <Route path="dashboard" element={<DashBoardContainer />} />
          <Route path="create-event" element={<EventCreateContainer />} />
        </Route>

        {/* Private admin */}
        {/* <Route path="admin" element={<ProtectRouteUser element={<Layout />} />}>
          <Route path="photographForm" element={<Photographerinfo />} />
        </Route> */}

         {/* Private super-admin */}
        {/* <Route path="super-admin" element={<ProtectRouteUser element={<Layout />} />}>
          <Route path="photographForm" element={<Photographerinfo />} />
        </Route> */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
