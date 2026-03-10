import React from 'react';
import { Camera, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl">
                <Camera className="w-6 h-6 text-blue-700" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">
                All-Event-Pictures
              </span>
            </Link>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              Capture your precious moments with our professional photography service and find them instantly.
            </p>
            <div className="flex gap-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all">
                <Facebook size={18} />
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all">
                <Instagram size={18} />
              </div>
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 cursor-pointer transition-all">
                <Twitter size={18} />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-blue-600 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-4 text-blue-100/70 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Browse Events</li>
              <li className="hover:text-white transition-colors cursor-pointer">Search by Face</li>
              {/* <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li> */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-blue-600 pb-2 inline-block">Support</h4>
            <ul className="space-y-4 text-blue-100/70 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-b border-blue-600 pb-2 inline-block">Contact Us</h4>
            <div className="space-y-4 text-blue-100/80 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-blue-300" />
                <span>99/99 Example Tower, Sukhumvit Rd, Bangkok, Thailand</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-blue-300" />
                <span>+66 2 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-blue-300" />
                <span>support@alleventpics.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-blue-600 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-200/50 text-xs font-medium tracking-wider uppercase">
            © 2026 All-Event-Pictures. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;