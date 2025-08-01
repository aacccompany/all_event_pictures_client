import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Camera, Menu, X, UserRound, Mail, LockKeyhole } from 'lucide-react';



// Standalone Login Dialog Component
const DialogLogin = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-white/30 backdrop-blur-lg z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-center">
                    <UserRound className="h-7 w-7 text-blue-700" />
                    <h2 className="text-xl font-bold text-gray-800">Login</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <div className="grid gap-4 py-4 mt-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                        <input id="email" placeholder="user@email.com" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" placeholder="Enter Your Password" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="grid gap-y-3">
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Forgot your password?</a>
                        <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Don't have an account?</a>
                    </div>
                </div>
                <button type="submit" className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Log in
                </button>
            </div>
        </div>
    );
};

// Main Navigation Component
const Nav = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEventMenuOpen, setIsEventMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const eventMenuRef = useRef(null);

    // Close event dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (eventMenuRef.current && !eventMenuRef.current.contains(event.target)) {
                setIsEventMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="flex items-center justify-between w-full mx-auto h-20 px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2 flex-shrink-0">
                        <Camera className="w-8 h-8 text-blue-700" />
                        <span className="font-bold text-lg text-gray-800">EVENTPIC</span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-700 hover:text-white">Home</a>
                        {/* <div className="relative" ref={eventMenuRef}>
                            <button onClick={() => setIsEventMenuOpen(!isEventMenuOpen)} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700  hover:bg-blue-700 hover:text-white flex items-center">
                                Event
                            </button>
                            {isEventMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white">All Event</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white">Active</a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-700 hover:text-white">Recent</a>
                                    </div>
                                </div>
                            )}
                        </div> */}
                        <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-700 hover:text-white">Event</a>
                        <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-700 hover:text-white">Download</a>
                    </div>

                    {/* Right side Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100">
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsLoginOpen(true)} className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800">
                            Login
                        </button>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMobileMenu} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu (Sheet) */}
            <div className={`fixed inset-0 z-50 md:hidden transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-lg" onClick={toggleMobileMenu}></div>
                <div className="relative w-64 h-full bg-white ml-auto p-6 shadow-xl">
                    <button onClick={toggleMobileMenu} className="absolute top-5 right-5 p-2 text-gray-500">
                        <X size={24} />
                    </button>
                    <div className="grid gap-4 pt-8">
                        <a href="#" onClick={toggleMobileMenu} className="text-lg font-semibold text-gray-800 hover:text-blue-700">Home</a>
                        <a href="#" onClick={toggleMobileMenu} className="text-lg font-semibold text-gray-800 hover:text-blue-700">Events</a>
                        <a href="#" onClick={toggleMobileMenu} className="text-lg font-semibold text-gray-800 hover:text-blue-700">Download</a>
                        <div className="pt-6 border-t mt-4">
                            <button onClick={() => { setIsLoginOpen(true); toggleMobileMenu(); }} className="w-full px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800">
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

