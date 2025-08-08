import React from 'react'
import { 
    Calendar, 
    MapPin, 
    Users, 
    Heart, 
    Upload, 
    PlusCircle 
} from 'lucide-react';
import { Input } from '../ui/input';


const EventView = () => {
    // Mock data for the photo gallery
    const photos = [
        { id: 1, src: "https://placehold.co/600x400/2D3748/FFFFFF?text=Runner+1", price: "59 THB" },
        { id: 2, src: "https://placehold.co/600x400/9F7AEA/FFFFFF?text=Workout", price: "59 THB" },
        { id: 3, src: "https://placehold.co/600x400/4299E1/FFFFFF?text=Swimming", price: "59 THB" },
        { id: 4, src: "https://placehold.co/600x400/ED8936/FFFFFF?text=Marathon+View", price: "59 THB" },
        { id: 5, src: "https://placehold.co/600x400/48BB78/FFFFFF?text=Stretching", price: "59 THB" },
        { id: 6, src: "https://placehold.co/600x400/F56565/FFFFFF?text=Event+Photo", price: "59 THB" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* --- Section 1: Event Header --- */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">Event ID: 1</p>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            KK RUN 2025
                        </h1>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-gray-600">
                        
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>March 15, 2025</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span>KHONKAEN THAILAND</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span>2,500 participants</span>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className="text-gray-700 leading-relaxed max-w-3xl">
                            Join thousands of runners in the beautiful city of Chiang Mai for our annual marathon event. Experience the scenic routes through historic temples and vibrant local communities.
                        </p>
                    </div>
                    <div className="mt-5 text-sm text-gray-500">
                        Organized by Thailand Marathon Association
                    </div>
                </section>

                {/* --- Section 2: Search by Face --- */}
                <section className="mt-8">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2">
                            
                            <h2 className="text-xl font-semibold text-gray-800">Search Your Photos by Face</h2>
                        </div>
                        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                            
                            <Upload className="w-10 h-10 text-gray-400"/>
                            <p className="mt-4 text-lg font-medium text-gray-700">Upload a photo of your face</p>
                            <p className="mt-1 text-sm text-gray-500">Drag and drop your photo here, or click to browse</p>
                            <p className="mt-2 text-xs text-gray-400">Supports: JPG, PNG (Max 10MB)</p>
                            <button className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                                Upload & Search Photos
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- Section 3: All Event Photos --- */}
                <section className="mt-8">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">All Event Photos</h2>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {photos.map((photo) => (
                                <div key={photo.id} className="group relative overflow-hidden rounded-lg">
                                    <img 
                                        src={photo.src} 
                                        alt={`Event photo ${photo.id}`} 
                                        className="w-full h-full object-cover aspect-video transform group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Error'; }}
                                    />
                                    {photo.price && (
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                                            <p className="text-white text-2xl font-bold">{photo.price}</p>
                                            <button className="mt-3 bg-white text-gray-800 font-semibold px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                                
                                                <PlusCircle className="w-4 h-4"/>
                                                Add to Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default EventView;
