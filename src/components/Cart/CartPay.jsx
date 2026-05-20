import {
  download_my_cart,
  get_my_cart,
  remove_image_from_cart,
  create_stripe_checkout_session
} from "@/api/cart";
import useAuthStore from "@/stores/auth-store";
import useCartStore from "@/stores/cart-store";
import React, { useEffect, useState } from "react";
import { TrashIcon, Download, ShoppingBag, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const CartDownload = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleMyCart();
  }, []);

  useEffect(() => {
    setCartCount(data?.cart_images?.length || 0);
  }, [data, setCartCount]);

  const handleMyCart = async () => {
    try {
      const res = await get_my_cart(token);
      console.log("Cart Data:", res.data);
      console.log("Cart Images:", res.data?.cart_images);
      if (res.data?.cart_images) {
        res.data.cart_images.forEach((item, index) => {
          console.log(`Item ${index}:`, {
            id: item.id,
            image: item.image?.id,
            event: item.image?.event?.id,
            image_price: item.image?.event?.image_price
          });
        });
      }
      setData(res.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setData({});
      }
      console.log(error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await remove_image_from_cart(token, id);
      await handleMyCart();
      toast.success("Removed from cart");
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };
  
  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await download_my_cart(token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.first_name || "user"}_Photos.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!");
      await handleMyCart();
    } catch (error) {
      toast.error("Download failed");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckout = async () => {
    try {
      const successUrl = `${window.location.origin}/user-public/download?payment_success=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/user-public/cart`;
      const res = await create_stripe_checkout_session(token, successUrl, cancelUrl);
      window.location.href = res.data.checkout_url;
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);

      // Handle specific error messages
      const errorMessage = error.response?.data?.detail || error.message;

      if (errorMessage?.includes("Minimum purchase amount") || errorMessage?.includes("10 THB")) {
        toast.error(" Minimum purchase is 10 THB. Add more items to proceed!");
      } else if (errorMessage?.includes("Cart is empty")) {
        toast.error(" Your cart is empty. Add some photos first!");
      } else if (errorMessage?.includes("Payment service error")) {
        toast.error(" Payment service is temporarily unavailable. Please try again.");
      } else {
        toast.error(` ${errorMessage || "Failed to initiate checkout. Please try again."}`);
      }
    }
  };

  const handleFreeDownload = async () => {
    await handleDownload();
  };
  const isCartEmpty = !data?.cart_images || data.cart_images.length === 0;
  const hasPaidItems = data?.cart_images?.some(item => {
    const event = item.image?.event;
    return event && event.image_price > 0;
  });
  const hasFreeItems = data?.cart_images?.some(item => {
    const event = item.image?.event;
    return !event || event.image_price === 0;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Cart</h1>
            <p className="text-slate-500 font-medium text-sm">Review and download your selected moments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ซ้าย: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {isCartEmpty ? (
              <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <ImageIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
                <p className="text-slate-400 mb-8 max-w-xs mx-auto">Go back to event gallery to find your amazing photos!</p>
                {/* <button 
                  onClick={() => window.history.back()}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Explore Events
                </button> */}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-slate-800">
                    Selected Photos <span className="text-blue-600 ml-1">({data.cart_images.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {data.cart_images.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img
                          src={item.image.optimized_url || item.image.preview_url}
                          alt="Event Photo"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Watermark Overlay - 4 Watermarks */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center justify-center">
                                <div className="transform -rotate-45 text-white/40 font-bold text-[10px] md:text-xs px-1 py-0.5   ">
                                  AllEventPictures
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Overlay & Trash Button */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 text-slate-400 hover:text-rose-500 hover:bg-white shadow-lg transition-all transform hover:scale-110"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <div className="p-3 bg-white">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          Photo #{item.image.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ขวา: Download Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Summary</h2>

              <div className="space-y-4 py-6 border-y border-slate-50">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Quantity</span>
                  <span className="text-slate-900 font-bold">{data?.cart_images?.length || 0} Photos</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-slate-900 font-bold">Price</span>
                  {hasPaidItems ? (
                    <span className="text-blue-600 font-black">Paid Items</span>
                  ) : hasFreeItems ? (
                    <span className="text-green-600 font-black">Free</span>
                  ) : (
                    <span className="text-slate-400 font-black">Empty</span>
                  )}
                </div>
              </div>

              {/* Show appropriate button based on cart content */}
              {hasFreeItems && !hasPaidItems && (
                <>
                  <button
                    type="button"
                    onClick={handleFreeDownload}
                    disabled={isCartEmpty || loading}
                    className={`w-full group relative flex items-center justify-center gap-3 py-4 mt-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                      ${isCartEmpty || loading
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98] shadow-green-100"
                      }`}
                  >
                    {loading ? "Processing..." : (
                      <>
                        <Download className="w-5 h-5" />
                        Download All (.zip)
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-green-50 rounded-xl flex gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 shrink-0" />
                    <p className="text-[11px] text-green-700 leading-relaxed">
                      Download all photos instantly without payment
                    </p>
                  </div>
                </>
              )}

              {hasPaidItems && (
                <>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCartEmpty || loading}
                    className={`w-full group relative flex items-center justify-center gap-3 py-4 mt-6 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                      ${isCartEmpty || loading
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-100"
                      }`}
                  >
                    {loading ? "Processing..." : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Checkout with Stripe
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-xl flex gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Secure payment via Stripe. Support photographers!
                    </p>
                  </div>
                </>
              )}

              <div className="mt-8 p-4 bg-slate-50 rounded-2xl flex gap-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-600/70 leading-relaxed">
                  High-quality ZIP files ready for instant download.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDownload;
