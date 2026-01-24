import React, { useState, useEffect } from "react";
import useAuthStore from "@/stores/auth-store";
import { get_profile, update_profile } from "@/api/user";
import { toast } from "sonner";
import { Save } from "lucide-react";

const AdminProfile = () => {
    const { token } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        tel: "",
        address: "",
        date_of_birth: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await get_profile(token);
                const user = res.data.payload || res.data;
                setUserData(user);
                setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    tel: user.tel || "",
                    address: user.address || "",
                    date_of_birth: user.date_of_birth || "",
                    email: user.email || "",
                    password: "",
                    confirm_password: ""
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

        if (formData.password && formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match!");
            return;
        }

        const dataToSend = { ...formData };
        if (!dataToSend.password) {
            delete dataToSend.password;
            delete dataToSend.confirm_password;
        } else {
            delete dataToSend.confirm_password;
        }

        try {
            await update_profile(token, dataToSend);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.detail || "Failed to update profile");
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
                    <div className="bg-blue-600 px-8 py-10">
                        <div className="flex items-center gap-6">
                            <div className="text-white">
                                <h1 className="text-3xl font-bold font-sans">Admin Profile</h1>
                                <p className="text-blue-100 mt-1 opacity-90">Manage your account information</p>
                            </div>
                        </div>
                    </div>
                </div>

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
                                <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
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

                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <p className="text-xs text-red-500 mt-1">Warning: Changing email will require you to login with the new email.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="col-span-1 md:col-span-2 font-medium text-gray-700 border-b pb-2 mb-2">Change Password</div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleInputChange}
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
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
            </div>
        </div>
    );
};

export default AdminProfile;
