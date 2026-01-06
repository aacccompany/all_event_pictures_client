import React from "react";
import useAuthStore from "@/stores/auth-store";
import { User, Mail, ShieldCheck } from "lucide-react";

const Profile = () => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-xl text-slate-500">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
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

                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                                </div>
                                <p className="text-lg font-medium text-slate-900 break-all">{user.email}</p>
                            </div>

                            {/* Role Section */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Account Role</label>
                                </div>
                                <p className="text-lg font-medium text-slate-900 capitalize">{user.role || "User"}</p>
                            </div>
                        </div>

                        {/* Additional Details (if available in future) */}
                        <div className="border-t border-gray-100 pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
