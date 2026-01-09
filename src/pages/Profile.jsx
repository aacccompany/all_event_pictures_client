import React, { useState, useEffect } from "react";
import useAuthStore from "@/stores/auth-store";
import { get_profile, update_profile, update_book_bank_image } from "@/api/user";
import { toast } from "sonner";
import { User, Mail, ShieldCheck, Save, Image as ImageIcon, Upload } from "lucide-react";

const Profile = () => {
    const { token, user: authUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        tel: "",
        address: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await get_profile(token);
                setUserData(res.data);
                setFormData({
                    first_name: res.data.first_name || "",
                    last_name: res.data.last_name || "",
                    tel: res.data.tel || "",
                    address: res.data.address || "",
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            await update_profile(token, formData);
            toast.success("Profile updated successfully");
            // Refresh data ? Or just update local state if needed. 
            // The formData is already updated.
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataImage = new FormData();
        formDataImage.append('book_bank_image', file);

        try {
            const res = await update_book_bank_image(token, formDataImage);
            toast.success("Book Bank Image updated");
            // Update the displayed image
            // Assuming the response contains the new URL or we re-fetch
            const newUrl = res.data.book_bank_image || (res.data.payload && res.data.payload.book_bank_image);
            // Adjust based on actual API response structure. 
            // User request says: "Update the displayed image with the new URL returned in the response".

            if (newUrl) {
                setUserData(prev => ({ ...prev, book_bank_image: newUrl }));
            } else {
                // If API doesn't return URL directly, re-fetch profile
                const profileRes = await get_profile(token);
                setUserData(profileRes.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update image");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-xl text-slate-500">Loading user data...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-xl text-slate-500">User not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <User className="h-12 w-12 text-blue-600" />
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold font-sans">User Profile</h1>
                                <p className="text-blue-100 mt-1 opacity-90">Manage your account information</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Role */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Details</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4 text-blue-500" />
                                        <span className="text-slate-900 break-all">{userData.email}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Role</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                                        <span className="text-slate-900 capitalize">{userData.role || authUser?.role || "User"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Personal Info Form */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                            </div>

                            <form onSubmit={handleInfoSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Last Name"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="tel" // Changed to tel
                                            name="tel"
                                            value={formData.tel}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="0812345678"
                                        />
                                    </div>

                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Your address"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Book Bank Image Section - Only for Photographer (role === 'user') */}
                        {authUser?.role === 'user' && (
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                    <ImageIcon className="h-6 w-6 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-800">Book Bank Image</h3>
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/2">
                                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center relative group">
                                            {userData.book_bank_image ? (
                                                <img
                                                    src={userData.book_bank_image}
                                                    alt="Book Bank"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-slate-400 flex flex-col items-center">
                                                    <ImageIcon className="h-10 w-10 mb-2" />
                                                    <span>No image uploaded</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2 space-y-4">
                                        <p className="text-sm text-slate-600">
                                            Upload a clear image of your book bank. This is required for verifying your account and processing payments.
                                        </p>

                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="book-bank-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                            <label
                                                htmlFor="book-bank-upload"
                                                className="cursor-pointer inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all gap-2"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Upload New Image
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500 italic">
                                            Accepted formats: JPG, PNG. Max size: 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
