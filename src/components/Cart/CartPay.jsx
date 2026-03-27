import {
  download_my_cart,
  get_my_cart,
  remove_image_from_cart,
  create_stripe_checkout_session
} from "@/api/cart";
import useAuthStore from "@/stores/auth-store";
import useCartStore from "@/stores/cart-store";
import React, { useEffect, useState } from "react";
import { TrashIcon, Download, ShoppingBag, ArrowRight, Image as ImageIcon } from "lucide-react";
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
      const successUrl = `${window.location.origin}/user-public/download?payment_success=true&session_id={CHECKOUT_SESSION_ID}`; // Redirect to download page on success
      const cancelUrl = `${window.location.origin}/user-public/cart`; // Redirect back to cart on cancel
      const res = await create_stripe_checkout_session(token, successUrl, cancelUrl);
      window.location.href = res.data.checkout_url;
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      toast.error("Failed to initiate checkout. Please try again.");
    }
  };
  const isCartEmpty = !data?.cart_images || data.cart_images.length === 0;

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
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={item.image.preview_url}
                          alt="Event Photo"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
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
                          {item.image.public_id.split('/').pop()}
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
                  <span className="text-blue-600 font-black">Free</span>
                  {/* ปรับเป็นราคาจริงถ้ามีฟิลด์ราคา */}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isCartEmpty || loading}
                className={`w-full group relative flex items-center justify-center gap-3 py-4 mt-8 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl
                  ${isCartEmpty || loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-100"
                  }`}
              >
                {loading ? "Processing..." : (
                  <>
                    <Download className="w-5 h-5" />
                    Download All (.zip)
                  </>
                )}
              </button>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                <p className="text-[11px] text-blue-700/70 leading-relaxed italic">
                  Photos will be compressed into a high-quality ZIP file for your convenience.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                <span>Secure Checkout</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDownload;
