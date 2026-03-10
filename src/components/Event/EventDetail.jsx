import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { useParams } from "react-router";
import { get_event } from "@/api/event";
import SearchFace from "./SearchFace";
import EventPhoto from "./EventPhoto";

const EventDetail = () => {
  const [event, setEvent] = useState({});
  const [matchedPhotos, setMatchedPhotos] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await get_event(id);
      setEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchComplete = (photos) => {
    setMatchedPhotos(photos);
  };

  const handleClearSearch = () => {
    setMatchedPhotos(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* --- Section 1: Event Header --- */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* ส่วน Thumbnail (Horizontal Top) */}
          <div className="w-full h-48 md:h-64 relative bg-gray-100">
            {event.cover_photo ? (
              <img
                src={event.cover_photo}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon className="w-10 h-10 opacity-20" />
                <span className="ml-2 text-sm italic">No cover photo</span>
              </div>
            )}
            
            {/* Badge แสดงสถานะบนรูป */}
            <div className="absolute top-4 left-6">
              <span className="bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                active
              </span>
            </div>
          </div>

          {/* ส่วนเนื้อหาเดิมของคุณ */}
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start">
              <div className="invisible md:visible"> {/* ซ่อนพื้นที่ว่างถ้าอยากให้ ID เด่นชัด */}
              </div>
              <p className="text-sm text-gray-500">Event ID: {id}</p>
            </div>

            <div className="mt-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {event.title}
              </h1>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-gray-700 leading-relaxed max-w-3xl">
                {event.description}
              </p>
            </div>

            <div className="mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                 {event.created_by?.email?.charAt(0).toUpperCase()}
               </div>
               Organized by {event.created_by?.email}
            </div>
          </div>
        </section>

        {/* --- Section 2: Search by Face --- */}
        <SearchFace onSearchComplete={handleSearchComplete} />

        {/* --- Section 3: All Event Photos --- */}
        <EventPhoto 
          event={event} 
          matchedPhotos={matchedPhotos} 
          onClearSearch={handleClearSearch} 
        />
      </div>
    </div>
  );
};

export default EventDetail;