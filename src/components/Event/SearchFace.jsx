import { Upload,} from "lucide-react";
const SearchFace = () => {
  return (
    <div>
      <section className="mt-8">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Search Your Photos by Face
            </h2>
          </div>
          <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-700">
              Upload a photo of your face
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Drag and drop your photo here, or click to browse
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Supports: JPG, PNG (Max 10MB)
            </p>
            <button className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
              Upload & Search Photos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default SearchFace;
