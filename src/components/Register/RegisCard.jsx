import React from "react";
import {
  IdCard,
  CloudUpload,
  Banknote,
  PencilRuler,
  UserRound,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

const RegisCard = ({ 
  handleOnChange, 
  handleSubmit, 
  handleFileChange, 
  previewImage, 
  imageError,
  isLoading 
}) => {

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor - วงกลมฟุ้งๆ ด้านหลัง */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-transparent to-transparent pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* === Top Content Section (เนื้อหาอยู่ข้างบน) === */}
        <div className="text-center mb-12 space-y-6">          
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Photographer <span className="text-blue-600">Register</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Register as a photographer on <span className="font-bold text-slate-800">AllEventPictures</span> to showcase your talent, manage your shots easily, and turn your vision into earnings.
          </p>

          {/* Features Grid - ปรับเป็น 4 คอลัมน์เล็กๆ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <SmallFeature icon={<IdCard />} text="Official Pass" />
            <SmallFeature icon={<CloudUpload />} text="Easy Manage" />
            <SmallFeature icon={<Banknote />} text="Make Money" />
            <SmallFeature icon={<PencilRuler />} text="Dev Tools" />
          </div>
        </div>

        {/* === Bottom Form Section (ฟอร์มอยู่ข้างล่าง) === */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden group">
          <div className="p-8 md:p-12 lg:p-16">
            
            <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <UserRound className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                <p className="text-sm text-slate-400 font-medium">Join our professional photographer network</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Email Field */}
                <InputGroup 
                  label="Email Address" 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="photographer@example.com" 
                  onChange={handleOnChange} 
                />
                
                {/* Password Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Password" 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    onChange={handleOnChange} 
                  />
                  <InputGroup 
                    label="Confirm Password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    onChange={handleOnChange} 
                  />
                </div>
              </div>

              {/* PDPA Checkbox */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pdpa-photographer"
                  required
                  className="mt-1 w-4 h-4 text-blue-600 bg-slate-50 border-slate-200 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="pdpa-photographer" className="text-sm text-slate-500 cursor-pointer select-none">
                  I agree to the <a href="#" className="text-blue-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-medium hover:underline">Privacy Policy (PDPA)</a>.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative flex items-center justify-center py-5 px-8 border border-transparent rounded-2xl text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 font-bold text-lg shadow-2xl shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      Register Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* <div className="mt-10 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <button className="text-blue-600 font-bold hover:underline transition-all">Sign In</button>
              </p>
            </div> */}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-8 text-slate-300 text-xs tracking-widest uppercase font-medium">
          © 2026 EventPictures Pro Service
        </p>
      </div>
    </div>
  );
};

// --- Sub-components สำหรับความคลีนของโค้ด ---

const SmallFeature = ({ icon, text }) => (
  <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-50 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-blue-500 w-6 h-6">{icon}</div>
    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{text}</span>
  </div>
);

const InputGroup = ({ label, ...props }) => (
  <div className="flex flex-col space-y-2.5">
    <label htmlFor={props.id} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <input
      {...props}
      required
      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 placeholder:text-slate-300 text-slate-700 font-medium"
    />
  </div>
);

export default RegisCard;