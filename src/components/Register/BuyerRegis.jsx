import {
    Search,
    DownloadCloud,
    CreditCard,
    Heart,
    UserRound,
    ArrowRight,
    Sparkles
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
        tel: ""
    });

    const handleRedirect = () => {
        navigate("/");
    };

    const handleOnChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!form.password || !form.confirmPassword || !form.email)
                return toast.warning("Please fill in all required fields");
            if (form.password !== form.confirmPassword)
                return toast.warning("Passwords do not match");
            if (form.password.length < 8)
                return toast.warning("Password must be at least 8 characters long");

            const { confirmPassword, ...registerData } = form;
            await authRegisterUserPublic(registerData);
            toast.success("Welcome! Registration successful");
            handleRedirect();
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.detail || "Registration failed. Please try again.";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Light Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0" />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* === Top Content Section === */}
                <div className="text-center mb-12 space-y-6">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Create Your Account
                    </h1>

                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Join <span className="text-blue-600 font-bold">AllEventPictures</span> to find, purchase, and cherish your high-quality memories from every special event.
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                        <SmallFeature icon={<Search />} text="AI Face Search" />
                        <SmallFeature icon={<DownloadCloud />} text="High-Resolution Download" />
                        <SmallFeature icon={<CreditCard />} text="Easy Pay" />
                        <SmallFeature icon={<Heart />} text="Save Memories" />
                    </div>
                </div>

                {/* === Bottom Form Section === */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <UserRound className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Personal Information</h2>
                                <p className="text-sm text-slate-400">Please fill in your details below</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="First Name" id="first_name" name="first_name" type="text" placeholder="John" onChange={handleOnChange} />
                                <InputGroup label="Last Name" id="last_name" name="last_name" type="text" placeholder="Doe" onChange={handleOnChange} />
                            </div>

                            {/* Contact Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Phone Number" id="tel" name="tel" type="tel" placeholder="08x-xxx-xxxx" onChange={handleOnChange} />
                                <InputGroup label="Email Address" id="email" name="email" type="email" placeholder="john@example.com" onChange={handleOnChange} />
                            </div>

                            {/* Password Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Password" id="password" name="password" type="password" placeholder="••••••••" onChange={handleOnChange} />
                                <InputGroup label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" onChange={handleOnChange} />
                            </div>

                            {/* PDPA Checkbox */}
                            <div className="flex items-start gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="pdpa-buyer"
                                    required
                                    className="mt-1 w-4 h-4 text-blue-600 bg-slate-50 border-slate-200 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="pdpa-buyer" className="text-sm text-slate-500 cursor-pointer select-none">
                                    I agree to the <a href="#" className="text-blue-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-medium hover:underline">Privacy Policy (PDPA)</a>.
                                </label>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full group relative flex items-center justify-center py-4 px-6 border border-transparent rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-bold text-lg shadow-xl shadow-blue-100"
                                >
                                    Create My Account
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>

                        {/* <div className="mt-10 text-center">
                            <p className="text-slate-500">
                                Already have an account?{" "}
                                <button onClick={handleRedirect} className="text-blue-600 font-bold hover:underline transition-all">
                                    Sign In here
                                </button>
                            </p>
                        </div> */}
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center mt-8 text-slate-400 text-sm">
                    © 2024 AllEventPictures. All rights reserved.
                </p>
            </div>
        </div>
    );
};

// Sub-components
const SmallFeature = ({ icon, text }) => (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm">
        <div className="text-blue-500 w-5 h-5">{icon}</div>
        <span className="text-xs font-bold text-slate-600">{text}</span>
    </div>
);

const InputGroup = ({ label, ...props }) => (
    <div className="flex flex-col space-y-2">
        <label htmlFor={props.id} className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
            {label}
        </label>
        <input
            {...props}
            required
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-300 text-slate-700"
        />
    </div>
);

export default BuyerRegis;
