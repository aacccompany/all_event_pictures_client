import React, { useState, useEffect } from "react";
import useAuthStore from "@/stores/auth-store";
import { get_profile, update_profile, update_book_bank_image, get_bank_info, update_bank_info } from "@/api/user";
import { toast } from "sonner";
import { User, Mail, ShieldCheck, Save, Image as ImageIcon, Upload, Landmark } from "lucide-react";

const Profile = () => {
    const THAI_BANKS = [
        { code: 'BBL', name: 'Bangkok Bank' },
        { code: 'KBANK', name: 'Kasikornbank' },
        { code: 'KTB', name: 'Krungthai Bank' },
        { code: 'SCB', name: 'Siam Commercial Bank' },
        { code: 'BAY', name: 'Bank of Ayudhya (Krungsri)' },
        { code: 'TTB', name: 'TMBThanachart Bank' },
        { code: 'GSB', name: 'Government Savings Bank' },
        { code: 'KKP', name: 'Kiatnakin Phatra Bank' },
        { code: 'CIMBT', name: 'CIMB Thai Bank' },
        { code: 'TISCO', name: 'TISCO Bank' },
        { code: 'UOB', name: 'United Overseas Bank (UOB)' },
        { code: 'LH', name: 'Land and Houses Bank' },
    ];

    const { token, user: authUser } = useAuthStore();
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
    const [bankData, setBankData] = useState({
        bank_name: "",
        bank_branch: "",
        account_name: "",
        account_number: "",
        citizen_id: ""
    });
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isCustomBank, setIsCustomBank] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await get_profile(token);
                const user = res.data.payload || res.data;
                console.log("Fetched User Data:", user);
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

                // Fetch Bank Info if user is not public (assuming logic based on role)
                if (authUser?.role === 'user') {
                    try {
                        const bankRes = await get_bank_info(token);
                        if (bankRes.data) {
                            const bankName = bankRes.data.bank_name || "";
                            const isKnownBank = THAI_BANKS.some(b => b.name === bankName);
                            setIsCustomBank(!!bankName && !isKnownBank);

                            setBankData({
                                bank_name: bankName,
                                bank_branch: bankRes.data.bank_branch || "",
                                account_name: bankRes.data.account_name || "",
                                account_number: bankRes.data.account_number || "",
                                citizen_id: bankRes.data.citizen_id || ""
                            });
                        }
                    } catch (err) {
                        console.log("No bank info found or error fetching", err);
                    }
                }
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

    const handleBankInputChange = (e) => {
        const { name, value } = e.target;
        setBankData(prev => ({ ...prev, [name]: value }));
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match!");
            return;
        }

        // Prepare data to send (exclude empty password/confirm_password to avoid sending them if not changed)
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
            delete dataToSend.password;
            delete dataToSend.confirm_password;
        } else {
            delete dataToSend.confirm_password; // Don't send confirm_pw to API
        }

        try {
            await update_profile(token, dataToSend);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.detail || "Failed to update profile");
        }
    };

    const handleBankInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            await update_bank_info(token, bankData);
            toast.success("Bank info updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update bank info");
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
            const newUrl = res.data.book_bank_image || (res.data.payload && res.data.payload.book_bank_image);


            if (newUrl) {
                setUserData(prev => ({ ...prev, book_bank_image: newUrl }));
            } else {
                const profileRes = await get_profile(token);
                setUserData(profileRes.data.payload || profileRes.data);
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
                    <div className=" bg-blue-600  px-8 py-10">
                        <div className="flex items-center gap-6">
                            <div className="text-white">
                                <h1 className="text-3xl font-bold font-sans">Photograper Profile</h1>
                                <p className="text-blue-100 mt-1 opacity-90">Manage your account information</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">

                    {/* Personal Info Form */}
                    {(authUser?.role === 'user-public' || authUser?.role === 'user') && (
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
                    )}

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
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => setIsImageModalOpen(true)}
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

                    {/* Bank Information Code - Only for Photographer */}
                    {authUser?.role === 'user' && (
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <Landmark className="h-6 w-6 text-blue-600" />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Bank Information</h3>
                                    <p className="text-sm text-gray-500">บัญชีธนาคารสำหรับรับเงิน</p>
                                </div>
                            </div>

                            <form onSubmit={handleBankInfoSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            ธนาคาร <span className="block text-xs font-normal text-gray-500">Bank</span>
                                        </label>
                                        <select
                                            name="bank_name"
                                            value={isCustomBank ? 'OTHER' : bankData.bank_name}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'OTHER') {
                                                    setIsCustomBank(true);
                                                    setBankData(prev => ({ ...prev, bank_name: "" }));
                                                } else {
                                                    setIsCustomBank(false);
                                                    setBankData(prev => ({ ...prev, bank_name: val }));
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                        >
                                            <option value="">Select Bank / เลือกธนาคาร</option>
                                            {THAI_BANKS.map((bank) => (
                                                <option key={bank.code} value={bank.name}>
                                                    {bank.name}
                                                </option>
                                            ))}
                                            <option value="OTHER">Other / อื่นๆ</option>
                                        </select>

                                        {isCustomBank && (
                                            <input
                                                type="text"
                                                name="bank_name"
                                                value={bankData.bank_name}
                                                onChange={handleBankInputChange}
                                                placeholder="Specify Bank Name / ระบุชื่อธนาคาร"
                                                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            สาขา <span className="block text-xs font-normal text-gray-500">Bank Branch</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="bank_branch"
                                            value={bankData.bank_branch}
                                            onChange={handleBankInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            ชื่อบัญชี <span className="block text-xs font-normal text-gray-500">Bank Account Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="account_name"
                                            value={bankData.account_name}
                                            onChange={handleBankInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            เลขที่บัญชี <span className="block text-xs font-normal text-gray-500">Bank Account Number</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="account_number"
                                            value={bankData.account_number}
                                            onChange={handleBankInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            เลขประจำตัวผู้เสียภาษี / เลขบัตรประชาชน <span className="block text-xs font-normal text-gray-500">TAX ID / THAI CITIZEN ID</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="citizen_id"
                                            value={bankData.citizen_id}
                                            onChange={handleBankInputChange}
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
                                        Save Bank Info
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Image Modal */}
                    {isImageModalOpen && userData?.book_bank_image && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                                <img
                                    src={userData.book_bank_image}
                                    alt="Book Bank Full Size"
                                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                                />
                                <button
                                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
                                    onClick={() => setIsImageModalOpen(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profile;
