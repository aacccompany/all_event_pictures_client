import { useEffect, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router";
import { get_event } from "@/api/event";
import useAuthStore from "@/stores/auth-store";
import { upload_images } from "@/api/uploadimage";
import { toast } from "sonner";
import { API_BASE_URL } from "@/api/config";
import ManageImages from "../ManageImage/ManageImages";

const GrapherUpload = () => {
  const [files, setFiles] = useState([]);
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const token = useAuthStore((state) => state.token);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track images being processed by AI
  const [processingImages, setProcessingImages] = useState([]);

  // Trigger to refresh ManageImages
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    handleGetEvent();

    // Connect to WebSocket
    const wsUrl = API_BASE_URL.replace("http", "ws") + `/api/v1/ws/${id}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "COMPLETED") {
        setProcessingImages((prev) =>
          prev.map((img) => img.id === data.image_id ? { ...img, status: "COMPLETED" } : img)
        );
      } else if (data.type === "FAILED") {
        setProcessingImages((prev) =>
          prev.map((img) => img.id === data.image_id ? { ...img, status: "FAILED" } : img)
        );
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleGetEvent = async () => {
    try {
      const res = await get_event(id);
      setEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.warning("Please select images before uploading");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await upload_images(token, id, formData);
      toast.success("Images uploaded! AI is processing in the background.");

      // Add the new images to the processing list
      const newImages = res.data.map(img => ({
        id: img.id,
        secure_url: img.secure_url,
        status: img.status || "PENDING_AI"
      }));
      setProcessingImages(prev => [...prev, ...newImages]);

      // Tell ManageImages to refresh its list to show the new PENDING_AI items
      setRefreshTrigger(prev => prev + 1);

      setFiles([]);
    } catch (error) {
      console.error(error);
      toast.error("Upload failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 m-5">
      {/* Event Info */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 ">
        <div className="flex justify-between items-start">
          <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            active
          </span>
          <p className="text-sm text-gray-500">Event ID: {event.id}</p>
        </div>

        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
          {event.title}
        </h1>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
        </div>

        <p className="mt-5 text-gray-700 leading-relaxed max-w-3xl">
          {event.description}
        </p>

        <div className="mt-5 text-sm text-gray-500">
          Organized by {event.created_by?.email}
        </div>
      </section>

      {/* Upload Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 space-y-6">
        {/* Upload button */}
        <div className="flex justify-center ">
          {isSubmitting ? (
            <button
              type="button"
              disabled
              className="w-full flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg shadow cursor-not-allowed"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </button>
          ) : (
            <button
              onClick={handleUpload}
              className="w-full flex justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition"
            >
              UPLOAD
            </button>
          )}
        </div>

        {/* Upload area */}
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">
          <Upload className="w-10 h-10 text-gray-500" />
          <p className="text-gray-600 mt-2">คลิกหรือวางรูปภาพที่นี่</p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFilesChange}
          />
        </label>

        {/* Preview */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition bg-gray-50"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center aspect-square">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-white rounded-full shadow p-1 hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* File name */}
                <div className="bg-white/80 backdrop-blur-sm text-center py-1 px-2 text-xs text-gray-700 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Processing State */}
        {processingImages.length > 0 && (
          <div className="mt-8 border-t pt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {processingImages.filter(img => img.status === "COMPLETED" || img.status === "FAILED").length < processingImages.length && (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                )}
                AI Processing Status
              </h2>
              <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                {processingImages.filter(img => img.status === "COMPLETED").length} / {processingImages.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {processingImages.map((img) => (
                <div key={img.id} className="relative rounded-xl overflow-hidden shadow-sm border">
                  <img
                    src={img.secure_url}
                    alt={`uploaded-${img.id}`}
                    className={`w-full aspect-square object-cover transition duration-300 ${img.status === 'PENDING_AI' ? 'opacity-50 grayscale' : ''}`}
                  />
                  {/* Status Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white font-medium p-2 text-center">
                    {img.status === "PENDING_AI" && (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs">Finding Faces...</span>
                      </>
                    )}
                    {img.status === "COMPLETED" && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs shadow-lg">Ready!</span>
                    )}
                    {img.status === "FAILED" && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs shadow-lg">Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Management Section */}
      <ManageImages eventId={id} refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default GrapherUpload;
