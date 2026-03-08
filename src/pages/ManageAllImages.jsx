import React, { useState, useEffect } from "react";
import { get_all_managed_images, delete_manage_images } from "@/api/manageimage";
import useAuthStore from "@/stores/auth-store";
import { Loader2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";

const ManageAllImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const token = useAuthStore((state) => state.token);

    const fetchImages = async () => {
        try {
            const res = await get_all_managed_images(token);
            setImages(res.data);
        } catch (error) {
            console.error("Failed to fetch all managed images:", error);
            toast.error("Failed to load images.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchImages();
        }
    }, [token]);

    // Use WebSockets to listen to global updates across all events
    useEffect(() => {
        if (!token) return;

        // Use a unique approach or just rely on manual refresh for global 
        // unless the backend supports a global broadcast channel. 
        // For now, let's keep it simple with manual refresh or polling on 'PENDING_AI' status.
        const interval = setInterval(() => {
            const hasPending = images.some(img => img.status === "PENDING_AI");
            if (hasPending) {
                fetchImages();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [token, images]);


    const handleDelete = async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        setIsDeleting(true);
        try {
            await delete_manage_images(token, [imageId]);
            toast.success("Image deleted successfully");
            setImages(images.filter((img) => img.id !== imageId));
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete image");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Images Status</h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : images.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    No images uploaded yet.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thumbnail
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {images.map((img) => (
                                    <tr key={img.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="relative h-16 w-16 group/preview cursor-pointer" onClick={() => setSelectedImage(img)}>
                                                <img
                                                    src={img.preview_url}
                                                    alt="Thumbnail"
                                                    className="h-full w-full object-cover rounded shadow-sm group-hover/preview:opacity-75 transition"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 bg-black/40 rounded transition-opacity">
                                                    <Eye className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {img.event_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {img.status === "COMPLETED" && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    COMPLETED
                                                </span>
                                            )}
                                            {img.status === "PENDING_AI" && (
                                                <span className="px-2 inline-flex flex-row items-center gap-2 text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    <Loader2 className="w-3 h-3 animate-spin" /> PENDING_AI
                                                </span>
                                            )}
                                            {img.status === "FAILED" && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    FAILED
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(img.id)}
                                                disabled={isDeleting}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 disabled:opacity-50 transition-colors"
                                                title="Delete Image"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img
                            src={selectedImage.preview_url}
                            alt="Large Preview"
                            className="object-contain max-h-[90vh] rounded shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAllImages;
