import {
    Search,
    DownloadCloud,
    CreditCard,
    Heart,
    UserRound,
} from "lucide-react";
import { useState } from "react";
import { authRegisterUserPublic } from "@/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const BuyerRegis = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
    });


    const handleRedirect = () => {
        navigate("/");
    };

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        console.log(e.target.name, e.target.value)
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!form.password || !form.confirmPassword || !form.email)
                return toast.warning("Register Fail!");
            if (form.password != form.confirmPassword)
                return toast.warning("Password invalid");

            // Default image for public users
            const payload = { ...form, image: "https://placehold.co/600x400" };

            await authRegisterUserPublic(payload);
            toast.success("Registration successful");
            handleRedirect()
        } catch (error) {
            console.log(error);
            let msgError = "Register Fail!";

            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    // Handle Pydantic validation errors (array of objects)
                    msgError = detail.map(err => `${err.loc[1] || err.loc[0]}: ${err.msg}`).join(', ');
                } else if (typeof detail === 'object') {
                    // Handle other object-based errors
                    msgError = JSON.stringify(detail);
                } else {
                    // Handle string errors
                    msgError = detail;
                }
            }

            toast.warning(msgError);
        }
    };
    return (
        // Main container: โครงสร้างหลักยังคงเดิม
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 min-h-190 bg-grey-50 py-16 px-4 sm:px-6 lg:px-8">
            {/* === Left Content Section (ปรับเนื้อหาสำหรับ User) === */}
            <div className="text-center lg:text-left lg:max-w-xl">
                {/* เปลี่ยนหัวข้อหลัก */}
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                    Join AllEventPictures
                </h1>
                {/* เปลี่ยนคำอธิบาย */}
                <p className="mt-4 text-lg text-slate-600 max-w-lg mx-auto lg:mx-0">
                    Sign up to find, purchase, and download your memorable moments from
                    events.
                </p>

                {/* เปลี่ยนฟีเจอร์ให้เป็นประโยชน์สำหรับ User */}
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-1 lg:flex lg:flex-col lg:items-start lg:space-y-5">
                    <FeatureItem
                        icon={<Search className="h-8 w-8 text-blue-600" />}
                        text="Find Your Photos Instantly"
                    />
                    <FeatureItem
                        icon={<DownloadCloud className="h-8 w-8 text-blue-600" />}
                        text="High-Quality Downloads"
                    />
                    <FeatureItem
                        icon={<CreditCard className="h-8 w-8 text-blue-600" />}
                        text="Secure & Easy Payments"
                    />
                    <FeatureItem
                        icon={<Heart className="h-8 w-8 text-blue-600" />}
                        text="Cherish Your Moments"
                    />
                </div>
            </div>

            {/* === Right Form Section === */}
            <div className="w-full max-w-md lg:w-1/2 mt-12 lg:mt-0">
                <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-6 bg-white p-8 rounded-xl shadow-lg"
                >
                    {/* Form Header */}
                    <div className="flex items-center gap-3">
                        <UserRound className="h-7 w-7 text-blue-700" />
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Create Account
                        </h2>
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                        {/* First Name */}
                        <div>
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                id="first-name"
                                name="first_name"
                                type="text"
                                placeholder="Enter your first name"
                                required
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleOnChange}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                id="last-name"
                                name="last_name"
                                type="text"
                                placeholder="Enter your last name"
                                required
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleOnChange}
                            />
                        </div>
                        {/* Tel. */}
                        <div>
                            <label htmlFor="tel" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                id="tel"
                                name="tel"
                                type="number" // Changed to "tel" for better mobile support
                                placeholder="Enter your phone number"
                                required
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleOnChange}
                            />
                        </div>

                        {/* Email Address */}
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your-email@email.com"
                                required
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleOnChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                maxLength={16}
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleOnChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="md:col-span-2">
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                required
                                maxLength={16}
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={handleOnChange}
                            />
                        </div>


                    </div>
                    <button
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        type="submit"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

// A helper component (ไม่มีการเปลี่ยนแปลง)
const FeatureItem = ({ icon, text }) => (
    <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">{text}</h2>
    </div>
);

export default BuyerRegis;
