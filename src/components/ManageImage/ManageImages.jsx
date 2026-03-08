import React, { useState, useEffect } from "react";
import { get_manage_images, delete_manage_images } from "@/api/manageimage";
import useAuthStore from "@/stores/auth-store";
import { Loader2, Trash2, CheckSquare, Square, ChevronDown, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

// ─── Custom Confirm Dialog ────────────────────────────────────────────────────
const ConfirmDeleteDialog = ({ count, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
                onClick={onCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-gray-900 text-center">Delete Images</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
                You are about to permanently delete{" "}
                <span className="font-semibold text-gray-800">{count} image{count !== 1 ? "s" : ""}</span>.
                This action <span className="text-red-600 font-semibold">cannot be undone</span>.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-sm"
                >
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>
);

import { API_BASE_URL } from "@/api/config";

// ─── Main Component ───────────────────────────────────────────────────────────
const ManageImages = ({ eventId, refreshTrigger }) => {
    const [images, setImages] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [visibleCount, setVisibleCount] = useState(24);
    const [showConfirm, setShowConfirm] = useState(false);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        fetchImages();
    }, [eventId, refreshTrigger]);

    useEffect(() => {
        if (!eventId) return;

        // Connect to WebSocket to listen for AI processing updates
        const wsUrl = API_BASE_URL.replace("http", "ws") + `/api/v1/ws/${eventId}`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "COMPLETED" || data.type === "FAILED") {
                setImages((prevImages) =>
                    prevImages.map((img) =>
                        img.id === data.image_id ? { ...img, status: data.type } : img
                    )
                );
            }
        };

        return () => {
            ws.close();
        };
    }, [eventId]);

    const fetchImages = async () => {
        try {
            setIsLoading(true);
            const res = await get_manage_images(token, eventId);
            setImages(res.data);
            setSelectedIds([]);
            setVisibleCount(24);
        } catch (error) {
            console.error("Failed to fetch manage images", error);
            toast.error("Could not load manageable images.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === images.length && images.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(images.map((img) => img.id));
        }
    };

    const toggleImageSelection = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
        );
    };

    const handleDeleteConfirmed = async () => {
        setShowConfirm(false);
        try {
            setIsDeleting(true);
            await delete_manage_images(token, selectedIds);
            toast.success(`Successfully deleted ${selectedIds.length} image(s).`);
            setImages(images.filter((img) => !selectedIds.includes(img.id)));
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to delete images", error);
            toast.error("Error deleting images. Permission denied or server error.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
                <p className="text-gray-500">No images available for management.</p>
            </div>
        );
    }

    const allSelected = images.length > 0 && selectedIds.length === images.length;
    const visibleImages = images.slice(0, visibleCount);
    const hasMore = visibleCount < images.length;

    return (
        <>
            {/* Confirm Dialog */}
            {showConfirm && (
                <ConfirmDeleteDialog
                    count={selectedIds.length}
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Manage Uploaded Images{" "}
                        <span className="text-lg font-medium text-gray-400">({images.length})</span>
                    </h2>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
                        >
                            {allSelected
                                ? <CheckSquare className="w-5 h-5 text-indigo-600" />
                                : <Square className="w-5 h-5 text-gray-400" />}
                            Select All
                        </button>

                        <button
                            onClick={() => { if (selectedIds.length > 0) setShowConfirm(true); }}
                            disabled={selectedIds.length === 0 || isDeleting}
                            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto
                ${selectedIds.length === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm"
                                }`}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete Selected ({selectedIds.length})
                        </button>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {visibleImages.map((img) => {
                        const isSelected = selectedIds.includes(img.id);
                        return (
                            <div
                                key={img.id}
                                className={`relative group rounded-xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all duration-200
                  ${isSelected ? "border-indigo-500 scale-[0.98]" : "border-transparent hover:border-gray-300"}`}
                                onClick={() => toggleImageSelection(img.id)}
                            >
                                <img
                                    src={img.secure_url}
                                    alt={`manage-${img.id}`}
                                    loading="lazy"
                                    className="w-full aspect-square object-cover"
                                />

                                <div className={`absolute top-2 left-2 flex items-center justify-center w-6 h-6 rounded-md bg-white shadow-sm border
                  ${isSelected ? "border-indigo-500" : "border-gray-300"}`}
                                >
                                    {isSelected && <CheckSquare className="w-5 h-5 text-indigo-600" />}
                                </div>

                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    {img.status === "FAILED" && (
                                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">
                                            FAILED
                                        </span>
                                    )}
                                    {img.status === "PENDING_AI" && (
                                        <span className="bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-md">
                                            PROCESSING
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setVisibleCount((prev) => prev + 24)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <span>Load More ({images.length - visibleCount} remaining)</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ManageImages;
