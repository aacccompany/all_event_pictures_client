import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart, Camera, Menu, X, User as UserIcon } from "lucide-react";
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
import useCartStore from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { get_my_cart } from "@/api/cart";
import NotificationDropdown from "@/components/Nav/NotificationDropdown";

// ✅ helper function: ปรับสไตล์ Dropdown Item ให้ดูสะอาดขึ้น
const renderMenuItems = (links, actionLogout) => {
  return links.map((item, index) =>
    item.label === "Logout" ? (
      <DropdownMenuItem
        key={index}
        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-medium py-2"
        onClick={() => {
          actionLogout();
          window.location.href = "/";
        }}
      >
        {item.label}
      </DropdownMenuItem>
    ) : (
      <Link to={item.href} key={index}>
        <DropdownMenuItem className="cursor-pointer py-2 font-medium">
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
  const actionLogout = useAuthStore((state) => state.actionLogout);
  const cartCount = useCartStore((state) => state.cartCount);
  const setCartCount = useCartStore((state) => state.setCartCount);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventMenuRef.current && !eventMenuRef.current.contains(event.target)) {
        // handle dropdown logic
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (token && user?.role === "user-public") {
        try {
          const res = await get_my_cart(token);
          setCartCount(res.data?.cart_images?.length || 0);
        } catch (error) {
          if (error.response?.status === 404) setCartCount(0);
        }
      }
    };
    fetchCartCount();
  }, [token, user, setCartCount]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Left section - Logo */}
          <div className="flex items-center gap-8">
            <Link to={"/"} className="flex items-center gap-3 group transition-transform active:scale-95">
              {/* <div className="bg-blue-700 p-2 rounded-xl shadow-lg shadow-blue-200">
                <Camera className="w-6 h-6 text-white" />
              </div> */}
              <div className="">
                <img
                  src="/public/vite.svg" // เปลี่ยนเป็นที่อยู่ไฟล์ PNG ของคุณ
                  alt="Logo"
                  className="w-12 h-12 object-contain" // ปรับขนาด w- และ h- ตามความเหมาะสม
                />
              </div>
              <span className="font-black text-xl text-gray-900 tracking-tighter uppercase hidden sm:block">
                All-Event-<span className="text-blue-700">Pictures</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {publicLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right section - Desktop Actions */}
          <div className="flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3">
                <NotificationDropdown />

                {user.role === "user-public" && (
                  <Link to={"/user-public/cart"}>
                    <button className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-blue-200 transition-all relative">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </Link>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full flex items-center gap-2 pl-2 pr-4 border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {user.first_name}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2" align="end">
                    <DropdownMenuLabel className="font-bold text-gray-400 text-xs uppercase tracking-widest px-3 py-2">
                      {user.role?.replace("-", " ")}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "super-admin" && renderMenuItems(privateSuperAdminLinks, actionLogout)}
                    {user.role === "admin" && renderMenuItems(privateAdminLinks, actionLogout)}
                    {user.role === "user-public" && renderMenuItems(publicUserLinks, actionLogout)}
                    {user.role === "user" && renderMenuItems(privateUserLinks, actionLogout)}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-700 hover:bg-blue-800 rounded-full px-6 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
        <div
          className={`absolute right-0 w-72 h-full bg-white p-6 shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-blue-700 text-lg uppercase tracking-tight">Menu</span>
            <button onClick={toggleMobileMenu} className="p-2 bg-gray-100 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {publicLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={toggleMobileMenu}>
                <span className="block px-4 py-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all">
                  {link.name}
                </span>
              </Link>
            ))}

            {/* {!token && (
              <div className="pt-6 mt-4 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setIsLoginOpen(true);
                    toggleMobileMenu();
                  }}
                  className="w-full bg-blue-700 py-6 rounded-xl font-bold text-lg"
                >
                  Login
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>

      <DialogLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Nav;