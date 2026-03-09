import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white text-black border-t border-gray-100 mt-auto">
      {/* ส่วนเนื้อหาหลัก */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-black text-2xl font-bold tracking-tight">
              AllEvent<span className="text-blue-500">Pictures</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-md">
              Find your moments instantly using our AI facial recognition technology. 
              The future of event photography.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-bold mb-5 text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#find-photos" className="hover:text-blue-500 transition-colors">Find My Photos</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-500 transition-colors">How it Works</a></li>
              {/* <li><a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a></li> */}
            </ul>
          </div>

          {/* Support/Legal */}
          <div>
            <h3 className="text-black font-bold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#faq" className="hover:text-blue-500 transition-colors">FAQs</a></li>
              <li><a href="#terms" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* ส่วนท้ายสุด (Copyright) */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {currentYear} Alleventpictures. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-black cursor-pointer">Facebook</span>
            <span className="hover:text-black cursor-pointer">Instagram</span>
            <span className="hover:text-black cursor-pointer">Line OA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer