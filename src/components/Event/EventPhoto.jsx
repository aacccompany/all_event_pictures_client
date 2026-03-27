import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react"; 
import useAuthStore from "@/stores/auth-store";
import useCartStore from "@/stores/cart-store";
import DialogLogin from "../Login/DialogLogin";
import { add_cart } from "@/api/cart";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const EventPhoto = ({ event, matchedPhotos, onClearSearch }) => {
  const [liveImages, setLiveImages] = useState([]);

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

    return () => ws.close();
  }, [event?.id]);

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

  const navigateImage = useCallback((direction) => {
    if (!selectedImage) return;
    
    const currentIndex = liveImages.findIndex(img => img.id === selectedImage.id);
    const total = liveImages.length;
    
    const findNextValid = (startIdx, dir) => {
      let curr = startIdx;
      for (let i = 0; i < total; i++) {
        curr = (curr + dir + total) % total;
        const target = liveImages[curr];
        if (target.status !== "PENDING_AI" && target.status !== "FAILED") {
          return target;
        }
      }
      return null;
    };

    const nextImg = findNextValid(currentIndex, direction);
    if (nextImg) setSelectedImage(nextImg);
  }, [selectedImage, liveImages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "ArrowRight") navigateImage(1);
      if (e.key === "ArrowLeft") navigateImage(-1);
      if (e.key === "Escape") closeImageViewer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, navigateImage]);

  const handleAddToCart = async (e, image) => {
    e.stopPropagation();
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      const body = { images_id: [image.id] };
      await add_cart(token, body);
      setCartCount(cartCount + 1);
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
                {image.status === "PENDING_AI" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white font-medium p-2 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs">Processing...</span>
                  </div>
                )}
                {image.status === "FAILED" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 text-white font-medium p-2 text-center">
                    <span className="text-xs font-bold text-red-200">Processing Failed</span>
                  </div>
                )}
                {image.status !== "PENDING_AI" && image.status !== "FAILED" && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <button
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

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="absolute inset-0 cursor-zoom-out" onClick={closeImageViewer} />
          
          {/* Navigation Buttons */}
          <button
            onClick={() => navigateImage(-1)}
            className="absolute left-4 z-50 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hidden md:block"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>
          <button
            onClick={() => navigateImage(1)}
            className="absolute right-4 z-50 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 hidden md:block"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          <div className="relative w-full max-w-6xl max-h-[95vh] flex items-center justify-center animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage?.preview_url}
              alt={`Event photo ${selectedImage.public_id}`}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg select-none"
            />
            <button
              onClick={closeImageViewer}
              className="absolute -top-4 -right-4 md:top-2 md:right-2 text-white bg-slate-900/50 hover:bg-slate-900 rounded-full p-3 transition-all duration-300 shadow-xl group border border-white/10"
            >
              <X className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                <p className="text-white/70 text-xs font-medium mr-4 hidden sm:block">
                  #{selectedImage.id}
                </p>
                <button
                   className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                   onClick={(e) => handleAddToCart(e, selectedImage)}
                >
                  Add to Cart
                </button>
            </div>
          </div>
        </div>
      )}
      <DialogLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default EventPhoto;
