import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PicLoad from '@/components/Download/PicLoad';
import { download_my_cart } from "@/api/cart";
import { verifyPayment } from "@/api/wallet"; // Import verifyPayment
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";

const Download = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentSuccess = searchParams.get('payment_success');
  const sessionId = searchParams.get('session_id'); // Get session_id
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handleDownload = async () => {
      if (paymentSuccess === 'true' && token && !downloadTriggered) {
        setDownloadTriggered(true); // Prevent multiple downloads

        try {
          if (sessionId) {
            try {
              await verifyPayment(token, sessionId);
              toast.success("Payment verified and transaction recorded.");
            } catch (verifyError) {
              console.error("Verification failed", verifyError);
              // Decide if we block download? Maybe not, but warn.
              // toast.error("Payment verification failed, but downloading anyway.");
            }
          }

          toast.success("Payment successful! Your download will start shortly.");
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

  // Countdown timer and auto-redirect to home page
  useEffect(() => {
    if (paymentSuccess === 'true' && downloadTriggered) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/'); // Redirect to home page
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentSuccess, downloadTriggered, navigate]);

  return (
    <div>
      {paymentSuccess === 'true' ? (
        <div className="text-center py-10 px-4">
          <h2 className="text-3xl font-bold text-green-600">Thank You for Your Purchase!</h2>
          <p className="mt-4 text-lg text-gray-700">Your download should begin automatically.</p>
          <p className="text-md text-gray-500">If not, please refresh the page or contact support.</p>

          {downloadTriggered && countdown > 0 && (
            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                Redirecting to home page in <span className="font-bold text-blue-600">{countdown}</span> second{countdown !== 1 ? 's' : ''}...
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Home Now
              </button>
            </div>
          )}
        </div>
      ) : (
        <PicLoad />
      )}
    </div>
  );
};

export default Download;
