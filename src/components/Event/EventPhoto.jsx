import React, { useState } from "react";
import { X } from "lucide-react"; // Import ไอคอน X
import useAuthStore from "@/stores/auth-store";
import DialogLogin from "../Login/DialogLogin";
import { add_cart } from "@/api/cart";
import { toast } from "sonner";

const EventPhoto = ({ event, matchedPhotos, onClearSearch }) => {
  const imagesToDisplay = matchedPhotos && matchedPhotos.length > 0 ? matchedPhotos : event?.images ?? [];
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const token = useAuthStore((state) => state.token);

  const openImageViewer = (image) => {
    setSelectedImage(image);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const handleAddToCart = async (e, image) => {
    e.stopPropagation();

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      const body = { images_id: [image.id] };
      await add_cart(token, body);
      toast.success(`Add photo to cart successfully`);
    } catch (err) {
      const msgErr = err.response?.data?.detail || "Please try again";
      console.error(err);
      toast.warning(msgErr);
    }
  };

  return (
    <>
      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {matchedPhotos && matchedPhotos.length > 0 ? "Matched Photos" : "All Event Photos"}
          </h2>
          {matchedPhotos && matchedPhotos.length > 0 && (
              <button
                  onClick={onClearSearch}
                  className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                  Clear Search
              </button>
          )}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {imagesToDisplay.map((image) => (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-80 animate-backdrop"
            onClick={closeImageViewer}
          />
          <div
            className="relative max-w-4xl max-h-[90vh] animate-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage?.preview_url}
              alt={`Event photo ${selectedImage.public_id}`}
              className="object-contain w-full h-full rounded-lg shadow-2xl"
            />
            <button
              onClick={closeImageViewer}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-all duration-200"
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
