import Nav from "@/pages/Nav";
import { Outlet } from "react-router";
import Footer from "@/components/Footer/Footer";

const Layout = () => {
  return (
    <main>
      <Nav />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
