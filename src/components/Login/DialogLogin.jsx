import { X, UserRound, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import useAuthStore from "@/stores/auth-store";

const DialogLogin = ({ isOpen, onClose }) => {
  const actionLogin = useAuthStore((state) => state.actionLogin);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleRedirect = () => {
    navigate("/register/photographer");
    onClose();
  };

  const handleRedirectBuyer = () => {
    navigate("/register/user");
    onClose();
  };

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const authSubmit = async (e) => {
    e.preventDefault();
    try {
      await actionLogin(form);
      toast.success("Welcome back!");
      navigate("/");
      onClose();
    } catch (error) {
      const msgError = error.response?.data?.detail || "Login failed";
      toast.error(msgError);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* ปรับขนาด w-full max-w-[380px] เพื่อให้เป็นหน้าต่างที่ดู Compact พอดีๆ */}
      <div
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[380px] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - ปรับตำแหน่งให้ดูลงตัวขึ้น */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {/* Header - กระชับพื้นที่ขึ้น */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-3">
              <UserRound size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login</h2>
            <p className="text-sm text-slate-400 mt-1">Please enter your credentials</p>
          </div>

          <form onSubmit={authSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@email.com"
                  autoFocus
                  onChange={handleOnChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleOnChange}
                  required
                />
              </div>
            </div>

            {/* Login Button - ปรับ py ให้กระชับขึ้น */}
            <button
              type="submit"
              className="w-full group flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-[0.98] transition-all mt-2"
            >
              Sign In
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Registration Links - ปรับดีไซน์ให้ดูเป็นระเบียบในพื้นที่จำกัด */}
          <div className="mt-6 pt-5 border-t border-slate-50">
            <p className="text-center text-[11px] text-slate-400 mb-3 font-medium">New to EventPictures?</p>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={handleRedirectBuyer}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-between group"
              >
                <span>User <span className="text-blue-600 font-bold">Register</span></span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>

              <button 
                onClick={handleRedirect}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-between group"
              >
                <span>Photographer <span className="text-blue-600 font-bold">Register</span></span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogLogin;