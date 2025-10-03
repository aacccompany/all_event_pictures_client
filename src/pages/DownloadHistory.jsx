import React, { useEffect, useState } from 'react';
import { get_download_history, re_download_cart } from "@/api/cart"; // เพิ่ม re_download_cart
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DownloadHistory = () => {
  const [history, setHistory] = useState([]);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchDownloadHistory = async () => {
      try {
        const res = await get_download_history(token);
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching download history:", error);
        toast.error("Failed to fetch download history.");
      }
    };

    if (token) {
      fetchDownloadHistory();
    }
  }, [token]);

  const handleReDownload = async (cartId) => {
    try {
      toast.info(`Initiating re-download for cart ID: ${cartId}`);
      
      const res = await re_download_cart(token, cartId); // เรียก API ใหม่
      let url = null;
      try {
        url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `cart_${cartId}_Photos.zip`); // ตั้งชื่อไฟล์
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Images re-downloaded successfully!");
      } finally {
        if (url) {
          window.URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error("Error during re-download:", error);
      toast.error("Failed to initiate re-download.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Download History</h1>
      {history.length === 0 ? (
        <p>No download history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number of Photos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.event_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.number_of_files}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(item.purchase_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <Button onClick={() => handleReDownload(item.id)} className="bg-blue-700 hover:bg-blue-800">Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DownloadHistory;
