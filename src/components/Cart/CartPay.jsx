import {
  download_my_cart,
  get_my_cart,
  remove_image_from_cart,
  create_stripe_checkout_session
} from "@/api/cart";
import useAuthStore from "@/stores/auth-store";
import useCartStore from "@/stores/cart-store";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

const CartDownload = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setCartCount = useCartStore((state) => state.setCartCount);
  const [data, setData] = useState({});

  useEffect(() => {
    handleMyCart();
  }, []);

  useEffect(() => {
    // Update cart count when data changes
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
      toast.success("Remove image successfully");
    } catch (error) {
      toast.warning("Image not found please try again");
      console.log(error);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await download_my_cart(token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.first_name || "user"}_Photo.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      await handleMyCart();
    } catch (error) {
      console.error(error);
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

  return (
    <>
      <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; }
      `}</style>
      <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ซ้าย: Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Photos ({data?.cart_images?.length || 0})
              </h2>

              {/* ✅ แสดงเป็น Grid ของรูป */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data?.cart_images?.map((item) => (
                  <div
                    key={item.id}
                    className="relative group border rounded-lg overflow-hidden shadow-sm"
                  >
                    <img
                      src={item.image.preview_url}
                      alt={`Photo ${item.id}`}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-gray-600 hover:text-red-500 transition"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <div className="p-2 text-xs text-gray-600 truncate">
                      {item.image.public_id.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ขวา: Download Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Download Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-800 font-bold text-lg">
                  <span>Total Photos</span>
                  <span>{data?.cart_images?.length || 0}</span>
                </div>
              </div>
              {/* <button
                type="button"
                onClick={handleCheckout}
                disabled={!data?.cart_images || data.cart_images.length === 0}
                className={`w-full font-bold py-3 mt-6 rounded-lg shadow-md hover:shadow-lg transition-colors
              ${!data?.cart_images || data.cart_images.length === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Checkout
              </button> */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={!data?.cart_images || data.cart_images.length === 0}
                className={`w-full font-bold py-3 mt-6 rounded-lg shadow-md hover:shadow-lg transition-colors
              ${!data?.cart_images || data.cart_images.length === 0
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                download
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By proceeding, you agree to our terms of service and privacy
                policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CartDownload;
