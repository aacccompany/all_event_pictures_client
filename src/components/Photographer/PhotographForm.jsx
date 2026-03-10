import React from 'react';
import { User, MapPin, Save, Camera } from 'lucide-react';

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1">
    {children}
  </label>
);

const Input = ({ id, type = "text", placeholder }) => (
  <input
    type={type}
    id={id}
    placeholder={placeholder}
    className="block w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 shadow-inner"
  />
);

const PhotographForm = () => {
  const personalFields = [
    { id: "f_name", label: "First Name", placeholder: "e.g. John" },
    { id: "l_name", label: "Last Name", placeholder: "e.g. Doe" },
    { id: "tel", label: "Phone Number", placeholder: "081-xxx-xxxx", type: "tel" },
    { id: "age", label: "Age", placeholder: "25", type: "number" },
  ];

  const addressFields = [
    { id: "address-line1", label: "Address (Street, Building)", placeholder: "99/99 Moo 9, Example Building", colSpan: true },
    { id: "subdistrict", label: "Sub-district", placeholder: "Khlong Tan Nuea" },
    { id: "district", label: "District", placeholder: "Watthana" },
    { id: "province", label: "Province", placeholder: "Bangkok" },
    { id: "postal-code", label: "Postal Code", placeholder: "10110", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
            <Camera className="w-4 h-4" />
            Official Profile
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Photographer <span className="text-blue-600">Profile</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            Please provide your accurate information to verify your identity and start your journey.
          </p>
        </div>

        <Card className="p-8 md:p-12">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-12">
            
            {/* Section 1: Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <User size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personalFields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input {...field} />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Address */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <MapPin size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Mailing Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addressFields.map((field) => (
                  <div key={field.id} className={field.colSpan ? 'md:col-span-2' : ''}>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input {...field} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full group flex items-center justify-center gap-3 py-5 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-100 active:scale-[0.98] transition-all duration-300"
              >
                <Save className="w-5 h-5" />
                Save Profile Information
              </button>
              <p className="text-center text-slate-400 text-xs mt-6 font-medium">
                © 2026 EventPictures Pro Service. All rights reserved.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PhotographForm;