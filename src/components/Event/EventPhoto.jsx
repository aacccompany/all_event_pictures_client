import React, { useState } from 'react';
import { X } from 'lucide-react'; // Import ไอคอน X

// --- Mockup รูปภาพ ---
const mockImages = [
  { public_id: 'mock1', secure_url: 'https://picsum.photos/seed/p1/600/600', price: 150 },
  { public_id: 'mock2', secure_url: 'https://picsum.photos/seed/p2/600/600', price: 100 },
  { public_id: 'mock3', secure_url: 'https://picsum.photos/seed/p3/600/600', price: 250 },
  { public_id: 'mock4', secure_url: 'https://picsum.photos/seed/p4/600/600', price: 120 },
  { public_id: 'mock5', secure_url: 'https://picsum.photos/seed/p5/600/600', price: 150 },
  { public_id: 'mock6', secure_url: 'https://picsum.photos/seed/p6/600/600', price: 180 },
  { public_id: 'mock7', secure_url: 'https://picsum.photos/seed/p7/600/600', price: 200 },
  { public_id: 'mock8', secure_url: 'https://picsum.photos/seed/p8/600/600', price: 100 },
];


const EventPhoto = ({ event }) => {
  // ตรวจสอบว่า event.images มีข้อมูลไหม ถ้าไม่มีให้ใช้ mockImages แทน
  const images = event?.images?.length ? event.images : mockImages;
  const [selectedImage, setSelectedImage] = useState(null);

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

  // --- Handlers ---
  const handleAddToCart = (e, image) => {
    e.stopPropagation();
    console.log('Added to cart:', image);
    alert(`เพิ่มรูป "${image.public_id}" ราคา ${image.price || 'N/A'} บาท ลงในตะกร้าแล้ว!`);
  };

  const openImageViewer = (image) => {
    setSelectedImage(image);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x600/CCCCCC/FFFFFF?text=Image+Error";
                  }}
                />
                
                {/* Price ใช้ไหมไม่รู้แต่ใส่มาเฉยๆ */}
                {image.price && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-sm font-bold px-2 py-1 rounded-full">
                        ฿{image.price}
                    </div>
                )}

                {/* Overlay ที่จะแสดงตอน hover */}
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

      {/* --- แสดงรูปภาพขนาดใหญ่ (Lightbox) --- */}
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
            .animate-content { animation: scaleUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
          `}</style>
          
          {/* Backdrop: This is the black area that will fade in */}
          <div
              className="absolute inset-0 bg-black bg-opacity-80 animate-backdrop"
              onClick={closeImageViewer}
          ></div>

          {/* Content: This holds the image and close button, and scales up */}
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
    </>
  );
};

export default EventPhoto;

