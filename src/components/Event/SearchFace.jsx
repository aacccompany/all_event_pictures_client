import { useRef, useState } from "react";
import { Upload, FileImage, Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { search_faces_in_event } from "@/api/event";
import useAuthStore from "@/stores/auth-store";

const SearchFace = ({ onSearchComplete }) => {
  const { id: event_id } = useParams();
  const { token } = useAuthStore();
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // Max 10MB
      toast.error("File size exceeds 10MB.");
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // Max 10MB
      toast.error("File size exceeds 10MB.");
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image to search.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await search_faces_in_event(event_id, token, selectedFile);
      onSearchComplete(res.data); // Pass matched photos to parent
      toast.success("Face search complete!");
    } catch (error) {
      console.error("Error searching faces:", error);
      toast.error(error.response?.data?.detail || "Failed to search faces.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Search Your Photos by Face
            </h2>
          </div>

          {/* Uploader section */}
          <div
            className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Hidden file input */}
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg"
            />

            {selectedFile ? (
              // Show this when a file is selected
              <div className="flex flex-col items-center gap-4">
                <FileImage className="w-12 h-12 text-blue-600" />
                <p className="text-lg font-medium text-gray-800">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              
              // Button not Activate when no file is selected
              <>
                <Upload className="w-10 h-10 text-gray-400" />
                <p className="mt-4 text-lg font-medium text-gray-700">
                  Upload a photo of your face
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop your photo here, or click to browse
                </p>
                {/* <p className="mt-2 text-xs text-gray-400">
                  Supports: JPG, PNG (Max 10MB)
                </p> */}
              </>
            )}
          </div>
          
          {/* Action Button */}
          <div className="mt-6 text-center">
             <button
              onClick={handleSearch}
              disabled={!selectedFile || isLoading}
              className="w-full bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Upload className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Searching..." : "Upload & Search Photos"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchFace;