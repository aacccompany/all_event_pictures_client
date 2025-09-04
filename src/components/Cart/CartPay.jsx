import { get_my_cart } from "@/api/cart";
import useAuthStore from "@/stores/auth-store";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";

const CartDownload = () => {
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState({});

  const handleMyCart = async () => {
    try {
      const res = await get_my_cart(token);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveItem = (id) => {
    console.log("remove item id:", id);
    // TODO: call API ลบรูปออกจาก cart
  };

  useEffect(() => {
    handleMyCart();
  }, []);

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
                      {item.image.public_id}
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
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Request Download Link
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
