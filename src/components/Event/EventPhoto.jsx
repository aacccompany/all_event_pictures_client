import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Import icon X

// --- Mock Components and Functions ---
// Since the original components/functions are in separate files not accessible here,
// these mock versions are created to make the component runnable.

/**
 * Mock Login Dialog Component.
 * In a real app, this would be imported from '../Login/DialogLogin'.
 */
const DialogLogin = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
        <h3 className="text-lg font-bold text-gray-800">จำเป็นต้องเข้าสู่ระบบ</h3>
        <p className="mt-2 text-gray-600">คุณต้องเข้าสู่ระบบเพื่อเพิ่มสินค้าลงในตะกร้า</p>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Mock Toast Notification Component.
 * This replaces the functionality of 'react-hot-toast'.
 */
const ToastNotification = ({ message, type, onClear }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClear();
        }, 3000); // Notification disappears after 3 seconds

        return () => clearTimeout(timer);
    }, [onClear]);

    const baseClasses = "fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-xl text-white font-semibold";
    const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            {message}
        </div>
    );
};


/**
 * A sub-component to display the PDPA consent modal.
 */
const PdpaConsent = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 transform transition-all animate-scaleUp">
        <h2 className="text-xl font-bold text-gray-800">คำยินยอมของเจ้าของข้อมูลส่วนบุคคล</h2>
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          เพื่อให้เป็นไปตามกฎหมายว่าด้วยการคุ้มครองข้อมูลส่วนบุคคล และสอดคล้องกับ{' '}
          <span className="font-semibold text-red-600">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</span> ของ All Event Picture ที่ถูกรวมไว้เป็นส่วนหนึ่งของ "ข้อตกลงการใช้บริการ" นี้แล้ว สิทธิของเจ้าของข้อมูลส่วนบุคคล ให้ถือว่าเจ้าของข้อมูลได้อนุญาตและยินยอมให้ใช้และเก็บรวบรวม ผลงานภาพถ่ายที่ปรากฏบนหน้าเว็บไซต์ โดยบริษัทจะนำผลงานดังกล่าวไปใช้เพื่อวัตถุประสงค์ในการให้บริการ รวมถึงการเปิดเผยข้อมูลส่วนบุคคลของเจ้าของภาพถ่ายให้แก่ เครื่องมือ หรือตัวแทนบุคคลที่สาม เพื่อประโยชน์ในการให้บริการด้านการตลาด การสื่อสารองค์กร เพื่อประชาสัมพันธ์ในโครงการต่าง ๆ ของบริษัท เพื่อประโยชน์ในการค้นหาภาพถ่ายของเจ้าของภาพถ่าย รวมถึงการนำภาพถ่ายไปกระทำซ้ำ ดัดแปลง ไม่ว่าส่วนบุคคลหรือบุคคลที่สามภายใต้{' '}
          <span className="font-semibold text-red-600">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</span> ของ All Event Picture โดยจะเก็บรวบรวม รักษาภาพถ่ายจนกว่าจะมีการแจ้งยกเลิก
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            ยอมรับ
          </button>
          <button
            onClick={onDecline}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
          >
            ไม่ยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * The main component to display event photos, now with PDPA consent logic.
 */
const EventPhoto = ({ event }) => {
  const images = event?.images ?? [];
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // Mock auth token from a store. Set to a mock value to simulate being logged in.
  // Set to `null` to test the login dialog functionality.
  const [token] = useState('mock-user-token'); 

  // State for managing PDPA consent
  const [hasConsented, setHasConsented] = useState(false);
  const [consentDeclined, setConsentDeclined] = useState(false);

  // Check for consent status in localStorage when the component first loads
  useEffect(() => {
    const consentStatus = localStorage.getItem('pdpaConsent');
    if (consentStatus === 'accepted') {
      setHasConsented(true);
    }
  }, []);

  const handleAcceptConsent = () => {
    localStorage.setItem('pdpaConsent', 'accepted');
    setHasConsented(true);
  };

  const handleDeclineConsent = () => {
    setConsentDeclined(true);
  };
  
  const handleAddToCart = async(e, image) => {
    e.stopPropagation();

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      // This is a mock API call that simulates success.
      // const res = await add_cart(token, { images_id: [image.id] });
      console.log("Adding to cart:", image.id);
      setNotification({ message: 'Add image to cart successfully', type: 'success' });
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Add image to cart error please try again', type: 'error' });
    }
  };

  const openImageViewer = (image) => {
    setSelectedImage(image);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  // --- Conditional Rendering Logic ---
  
  if (!hasConsented) {
    if (consentDeclined) {
      return (
         <section className="mt-8">
           <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 text-center">
             <h2 className="text-xl font-semibold text-gray-800">ไม่สามารถแสดงรูปภาพได้</h2>
             <p className="text-gray-500 mt-4">คุณจำเป็นต้องให้ความยินยอมตามนโยบายคุ้มครองข้อมูลส่วนบุคคลเพื่อดูรูปภาพในกิจกรรมนี้</p>
           </div>
         </section>
      );
    }
    return <PdpaConsent onAccept={handleAcceptConsent} onDecline={handleDeclineConsent} />;
  }

  if (!images.length) {
    return (
      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Photos</h2>
          <p className="text-gray-500 mt-4">No photos for this event yet.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {notification.message && (
          <ToastNotification 
              message={notification.message} 
              type={notification.type} 
              onClear={() => setNotification({ message: '', type: '' })} 
          />
      )}

      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            All Event Photos
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.public_id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openImageViewer(image)}
              >
                <img
                  src={image?.preview_url}
                  alt={`Event photo ${image?.public_id}`}
                  className="w-full h-full object-cover aspect-square transform group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x600/CCCCCC/FFFFFF?text=Image+Error";
                  }}
                />
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                  <button
                    title="View Photo"
                    className="px-4 py-2 bg-white text-sm font-semibold text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageViewer(image);
                    }}
                  >
                    View Photo
                  </button>
                  <button
                    title="Add to cart"
                    className="px-4 py-2 bg-blue-600 text-sm font-semibold text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={(e) => handleAddToCart(e, image)}
                  >
                    เพิ่มลงตะกร้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            .animate-backdrop { animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            .animate-content, .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          `}</style>
          
          <div
            className="absolute inset-0 bg-black bg-opacity-80 animate-backdrop"
            onClick={closeImageViewer}
          ></div>

          <div
            className="relative max-w-4xl max-h-[90vh] animate-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.secure_url}
              alt={`Event photo ${selectedImage.public_id}`}
              className="object-contain w-full h-full rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-all duration-200"
              aria-label="Close image viewer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      <DialogLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default EventPhoto;

