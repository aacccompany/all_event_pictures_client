import { useRef, useState } from "react";
import { Upload, FileImage } from "lucide-react";

const SearchFace = () => {
  // Create a ref for the hidden file input
  const inputRef = useRef(null);
  // State to hold the selected file's information
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to trigger the file input click
  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  // Function to handle the file selection
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here you would typically handle the file upload logic
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (opening file in browser)
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    console.log("Dropped file:", file);
    setSelectedFile(file);
    // Optionally, you can also trigger the upload here
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
              onClick={() => { /* Add your search/upload logic here */ alert(`Searching with ${selectedFile?.name || 'no file'}...`) }}
              disabled={!selectedFile}
              className="w-full bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload & Search Photos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchFace;