import React, { useState, useEffect } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react"; // Import ไอคอน X
import useAuthStore from "@/stores/auth-store";
import useCartStore from "@/stores/cart-store";
import DialogLogin from "../Login/DialogLogin";
import { add_cart } from "@/api/cart";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const EventPhoto = ({ event, matchedPhotos, onClearSearch }) => {
  const [liveImages, setLiveImages] = useState([]);

  // Sync the external images array with local state so we can patch objects when WS updates 
  useEffect(() => {
    const imagesToDisplay = matchedPhotos && matchedPhotos.length > 0 ? matchedPhotos : event?.images ?? [];
    setLiveImages(imagesToDisplay);
  }, [matchedPhotos, event?.images]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const token = useAuthStore((state) => state.token);
  const cartCount = useCartStore((state) => state.cartCount);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const [visibleCount, setVisibleCount] = useState(24);

  // Connect to WebSocket to listen for AI processing updates for the live grid
  useEffect(() => {
    if (!event?.id) return;
    const wsUrl = API_BASE_URL.replace("http", "ws") + `/api/v1/ws/${event.id}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (wsEvent) => {
      const data = JSON.parse(wsEvent.data);
      if (data.type === "COMPLETED" || data.type === "FAILED") {
        setLiveImages((prevImages) =>
          prevImages.map((img) =>
            img.id === data.image_id ? { ...img, status: data.type } : img
          )
        );
      }
    };

    return () => {
      ws.close();
    };
  }, [event?.id]);

  // Reset visible count if the images source changes (e.g., searching)
  useEffect(() => {
    setVisibleCount(24);
  }, [matchedPhotos, event?.images]);

  const displayedSubset = liveImages.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 24);
  };

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
      setCartCount(cartCount + 1); // Increment cart count
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
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {matchedPhotos && matchedPhotos.length > 0 ? "Matched Photos" : "All Event Photos"}
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
              {liveImages.length} photos
            </span>
          </div>
          {matchedPhotos && matchedPhotos.length > 0 && (
            <button
              onClick={onClearSearch}
              className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Clear Search
            </button>
          )}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedSubset.map((image) => (
              <div
                key={image.public_id}
                className="group relative overflow-hidden rounded-lg cursor-pointer bg-gray-100"
                onClick={() => {
                  if (image.status !== "PENDING_AI" && image.status !== "FAILED") {
                    openImageViewer(image);
                  }
                }}
              >
                <img
                  src={image?.preview_url}
                  alt={`Event photo ${image?.public_id}`}
                  loading="lazy"
                  className={`w-full h-full object-cover aspect-square transition-transform duration-300 ${image.status === "PENDING_AI" ? "opacity-50 grayscale" : "transform group-hover:scale-105"
                    }`}
                />

                {/* AI Processing Overlay */}
                {image.status === "PENDING_AI" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white font-medium p-2 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs">Processing...</span>
                  </div>
                )}

                {/* Failed Overlay */}
                {image.status === "FAILED" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 text-white font-medium p-2 text-center">
                    <span className="text-xs font-bold text-red-200">Processing Failed</span>
                  </div>
                )}

                {/* Hover overlay for completed images */}
                {image.status !== "PENDING_AI" && image.status !== "FAILED" && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <button
                      title="Add to cart"
                      className="px-4 py-2 bg-blue-600 text-sm font-semibold text-white rounded-md hover:bg-blue-700 transition-colors"
                      onClick={(e) => handleAddToCart(e, image)}
                    >
                      เพิ่มลงตะกร้า
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < liveImages.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span>Load More Photos</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
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
