import Nav from "@/pages/Nav";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main>
      <Nav />
      <Outlet />
    </main>
  );
};

export default Layout;
