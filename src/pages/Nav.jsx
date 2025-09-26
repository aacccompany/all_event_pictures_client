import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Camera, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router";
import DialogLogin from "@/components/Login/DialogLogin";
import {
  publicLinks,
  privateUserLinks,
  privateAdminLinks,
  privateSuperAdminLinks,
  publicUserLinks,
} from "@/utils/links";
import useAuthStore from "@/stores/auth-store";
import { Button } from "@/components/ui/button";

// ✅ helper function: ไม่ใช้ hook โดยตรง
const renderMenuItems = (links, actionLogout) => {
  return links.map((item, index) =>
    item.label === "Logout" ? (
      <DropdownMenuItem
        key={index}
        className="cursor-pointer"
        onClick={() => {
          actionLogout();
          window.location.href = "/";
        }}
      >
        {item.label}
      </DropdownMenuItem>
    ) : (
      <Link to={item.href} key={index}>
        <DropdownMenuItem className="cursor-pointer">
          {item.label}
        </DropdownMenuItem>
      </Link>
    )
  );
};

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const eventMenuRef = useRef(null);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const actionLogout = useAuthStore((state) => state.actionLogout); // ✅ ดึง actionLogout ที่นี่

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        eventMenuRef.current &&
        !eventMenuRef.current.contains(event.target)
      ) {
        // handle dropdown here if needed
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center w-full mx-auto h-20 px-4 sm:px-6 lg:px-8">
          {/* Left section - Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link to={"/"} className="flex items-center gap-2 flex-shrink-0">
              <Camera className="w-8 h-8 text-blue-700" />
              <span className="font-bold text-lg text-gray-800 uppercase">
                All-Event-Pictures
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {publicLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-700 hover:text-white">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Right section - Desktop Actions */}
          <div className="flex-1 flex items-center justify-end">
            {token && user.role === "super-admin" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-700 hover:bg-blue-800">
                    <Menu />
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="py-2 m-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {renderMenuItems(privateSuperAdminLinks, actionLogout)}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : token && user.role === "admin" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-700 hover:bg-blue-800">
                    <Menu />
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="py-2 m-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {renderMenuItems(privateAdminLinks, actionLogout)}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : token && user.role === "user-public" ? (
              <div className="flex items-center gap-2">
                <Link to={"/user-public/cart"}>
                  <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-blue-700 hover:bg-blue-800">
                      <Menu />
                      Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="py-2 m-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {renderMenuItems(publicUserLinks, actionLogout)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : token && user.role === "user" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-700 hover:bg-blue-800">
                    <Menu />
                    Menu
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="py-2 m-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {renderMenuItems(privateUserLinks, actionLogout)}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-lg"
          onClick={toggleMobileMenu}
        ></div>
        <div className="relative w-64 h-full bg-white ml-auto p-6 shadow-xl">
          <button
            onClick={toggleMobileMenu}
            className="absolute top-5 right-5 p-2 text-gray-500"
          >
            <X size={24} />
          </button>
          <div className="grid gap-4 pt-8">
            {publicLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <span
                  onClick={toggleMobileMenu}
                  className="text-lg font-semibold text-gray-800 hover:text-blue-700"
                >
                  {link.name}
                </span>
              </Link>
            ))}
            <div className="pt-6 border-t mt-4">
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  toggleMobileMenu();
                }}
                className="w-full px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <DialogLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Nav;
