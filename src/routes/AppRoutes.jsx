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
import EventView from "@/pages/EventView";
import UserEventList from "@/components/Photographer/UserEventList";

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
        <Route path="user" element={<ProtectRouteUser element={<Layout />} />}>
          <Route path="dashboard" element={<DashBoardContainer />} />
          <Route path="photographForm" element={<Photographerinfo />} />
          <Route path="event-lists" element={<UserEventList />} />
        </Route>

        {/* Private Admin */}
        <Route path="org" element={<ProtectRouteAdmin element={<Layout />} />}>
          <Route path="dashboard" element={<DashBoardContainer />} />
          <Route path="create-event" element={<EventCreateContainer />} />
        </Route>

        {/* Private Super-Admin */}
        <Route path="super-admin" element={<ProtectRouteUser element={<Layout />} />}>
           <Route path="dashboard" element={<DashBoardContainer />} />
          <Route path="event-lists" element={<UserEventList />} />
          <Route path="create-event" element={<EventCreateContainer />} />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
