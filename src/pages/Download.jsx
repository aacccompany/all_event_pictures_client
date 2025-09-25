import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PicLoad from '@/components/Download/PicLoad';
import { download_my_cart } from "@/api/cart";
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";

const Download = () => {
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get('payment_success');
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  useEffect(() => {
    const handleDownload = async () => {
      if (paymentSuccess === 'true' && token && !downloadTriggered) {
        setDownloadTriggered(true); // Prevent multiple downloads
        toast.success("Payment successful! Your download will start shortly.");
        try {
          const res = await download_my_cart(token);
          let url = null;
          try {
            url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${user.first_name || "user"}_Photos.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Images downloaded successfully!");
          } finally {
            if (url) {
              window.URL.revokeObjectURL(url);
            }
          }
        } catch (error) {
          console.error("Error during download:", error);
        }
      }
    };

    handleDownload();
  }, [paymentSuccess, token, user, downloadTriggered]);

  return (
    <div>
      {paymentSuccess === 'true' ? (
        <div className="text-center py-10">
          <h2 className="text-3xl font-bold text-green-600">Thank You for Your Purchase!</h2>
          <p className="mt-4 text-lg text-gray-700">Your download should begin automatically.</p>
          <p className="text-md text-gray-500">If not, please refresh the page or contact support.</p>
        </div>
      ) : (
        <PicLoad/>
      )}
    </div>
  );
};

export default Download;