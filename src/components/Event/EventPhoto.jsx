import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Import icon X

/**
 * A sub-component to display the PDPA consent modal.
 * This keeps the main component cleaner.
 */
const PdpaConsent = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 transform transition-all animate-scaleUp">
        <h2 className="text-xl font-bold text-gray-800">คำยินยอมของเจ้าของข้อมูลส่วนบุคคล</h2>
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
          เพื่อให้เป็นไปตามกฎหมายว่าด้วยการคุ้มครองข้อมูลส่วนบุคคล และสอดคล้องกับ{' '}
          <span className="font-semibold text-red-600">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</span> ของบริษัท Shutter run ที่ถูกรวมไว้เป็นส่วนหนึ่งของ "ข้อตกลงการใช้บริการ" นี้แล้ว สิทธิของเจ้าของข้อมูลส่วนบุคคล ให้ถือว่าเจ้าของข้อมูลได้อนุญาตและยินยอมให้ใช้และเก็บรวบรวม ผลงานภาพถ่ายที่ปรากฏบนหน้าเว็บไซต์ โดยบริษัทจะนำผลงานดังกล่าวไปใช้เพื่อวัตถุประสงค์ในการให้บริการ รวมถึงการเปิดเผยข้อมูลส่วนบุคคลของเจ้าของภาพถ่ายให้แก่ เครื่องมือ หรือตัวแทนบุคคลที่สาม เพื่อประโยชน์ในการให้บริการด้านการตลาด การสื่อสารองค์กร เพื่อประชาสัมพันธ์ในโครงการต่าง ๆ ของบริษัท เพื่อประโยชน์ในการค้นหาภาพถ่ายของเจ้าของภาพถ่าย รวมถึงการนำภาพถ่ายไปกระทำซ้ำ ดัดแปลง ไม่ว่าส่วนบุคคลหรือบุคคลที่สามภายใต้{' '}
          <span className="font-semibold text-red-600">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</span> ของบริษัท Shutter run โดยจะเก็บรวบรวม รักษาภาพถ่ายจนกว่าจะมีการแจ้งยกเลิก
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
  const [showLogin, setShowLogin] = useState(false); // ✅ state สำหรับ login dialog
  const token = useAuthStore((state) => state.token);

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
  
  const handleAddToCart = (e, image) => {
    e.stopPropagation();

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      const body = { images_id: [image.id] };
      const res = await add_cart(token, body);

      console.log("Cart updated:", res.data);
      toast.success(`Add image to cart successfully`);
    } catch (err) {
      console.error(err);
      toast.warning("Add image to cart error please try again")
    }
  };

  // --- Conditional Rendering Logic ---
  
  // 1. If consent has not been given, check what to display
  if (!hasConsented) {
    // 1.1 If the user explicitly declined consent, show a message
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
    // 1.2 Otherwise, show the consent modal
    return <PdpaConsent onAccept={handleAcceptConsent} onDecline={handleDeclineConsent} />;
  }

  // 2. If consent is given but there are no photos
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

  // 3. If consent is given and there are photos, display the gallery
  return (
    <>
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
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
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

      {/* --- Lightbox for large image view --- */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <style>{`
            /* Keyframes for animations */
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

            /* Animation classes */
            .animate-backdrop { animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            .animate-content, .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          `}</style>
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-80 animate-backdrop"
            onClick={closeImageViewer}
          ></div>

          {/* Content */}
          <div
            className="relative max-w-4xl max-h-[90vh] animate-content"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking on the image
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

      {/* --- Dialog Login --- */}
      <DialogLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default EventPhoto;
