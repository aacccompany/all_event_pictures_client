import React from 'react';
import { Search, Upload, Images, Download, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="w-8 h-8" />,
            title: "Select Event",
            description: "Choose your event from our extensive gallery."
        },
        {
            icon: <Upload className="w-8 h-8" />,
            title: "Upload Face",
            description: "Upload your photo to find yourself instantly."
        },
        {
            icon: <Images className="w-8 h-8" />,
            title: "Choose Photos",
            description: "Select your favorite photos and add them to the cart."
        },
        {
            icon: <Download className="w-8 h-8" />,
            title: "Checkout & Download",
            description: "Complete payment and instantly download your photos."
        }
    ];

    return (
        <section className="bg-gray-50/50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* --- Section Header --- */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        How It Works
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Finding your event photos is simple and fast.
                    </p>
                </div>

                {/* --- Steps Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative group">
                            {/* การ์ดรูปแบบใหม่: ขอบมนพิเศษและเงาที่นุ่มนวล */}
                            <div className="h-full bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 flex flex-col items-center text-center">
                                
                                {/* Step Number - ตัวเลขจางๆ ด้านหลัง */}
                                <span className="absolute top-6 right-8 text-5xl font-black text-slate-50 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                                    0{index + 1}
                                </span>

                                {/* Icon Container - ปรับเป็นทรงมนเหลี่ยม (Squircle) */}
                                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                    {step.icon}
                                </div>

                                {/* Text Content */}
                                <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    {step.description}
                                </p>

                                {/* ลูกศรบอกทาง (แสดงเฉพาะ Desktop ระหว่าง Card) */}
                                {index !== steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-10 text-slate-200">
                                        <ArrowRight size={24} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;