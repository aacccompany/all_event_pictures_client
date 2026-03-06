import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    
    <footer className="bg-white text-black py-1 px-6 mt-auto">
      
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
        </div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        

        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-black text-xl font-bold tracking-tight">
            AllEvent<span className="text-blue-500">Pictures</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs">
            Find your moments instantly using our AI facial recognition technology. 
            The future of event photography.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-black font-semibold mb-4 text-sm uppercase">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#find-photos" className="hover:text-blue-400 transition">Find My Photos</a></li>
            <li><a href="#how-it-works" className="hover:text-blue-400 transition">How it Works</a></li>
            <li><a href="#pricing" className="hover:text-blue-400 transition">Pricing</a></li>
          </ul>
        </div>

        {/* Support/Legal */}
        <div>
          <h3 className="text-black font-semibold mb-4 text-sm uppercase">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#faq" className="hover:text-blue-400 transition">FAQs</a></li>
            <li><a href="#terms" className="hover:text-blue-400 transition">Terms of Service</a></li>
            <li><a href="#privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>© {currentYear} Alleventpictures. All rights reserved.</p>
        {/* <p className="mt-2 md:mt-0 text-slate-500">Built with React & Vite</p> */}
      </div>
    </footer>
  )
}

export default Footer