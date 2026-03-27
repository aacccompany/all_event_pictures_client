import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Image as ImageIcon, Loader2 } from "lucide-react";
import { useParams } from "react-router";
import { get_event } from "@/api/event";
import SearchFace from "./SearchFace";
import EventPhoto from "./EventPhoto";

const EventDetail = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchedPhotos, setMatchedPhotos] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await get_event(id);
      setEvent(res.data);
    } catch (error) {
      console.error("Fetch Event Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchComplete = (photos) => {
    setMatchedPhotos(photos);
  };

  const handleClearSearch = () => {
    setMatchedPhotos(null);
  };  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600 font-medium tracking-wide">กำลังเตรียมความทรงจำของคุณ...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 bg-gray-50">
        <ImageIcon className="w-16 h-16 opacity-20 mb-4" />
        <p className="text-xl font-semibold">ไม่พบกิจกรรมนี้</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfdfe] min-h-screen font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* --- Section 1: Cinematic Event Header --- */}
        <section className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative group">
          
          {/* Cover Photo Area with Blurred Backdrop for Better Preview */}
          <div className="w-full h-[300px] md:h-[500px] relative overflow-hidden bg-slate-900">
            {event.image_cover ? (
              <>
                {/* Background Blurred Image (Fill the space) */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-110"
                  style={{ backgroundImage: `url(${event.image_cover})` }}
                />
                
                {/* Main Focused Image (Show actual aspect ratio) */}
                <img
                  src={event.image_cover}
                  alt={event.title}
                  className="w-full h-full object-contain relative z-10"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/1200x600?text=Image+Unavailable";
                  }}
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <ImageIcon className="w-20 h-20 opacity-10 mb-2" />
                <span className="text-sm font-medium">ไม่มีรูปหน้าปก</span>
              </div>
            )}
            
            {/* Status Badge */}
            {event.active && (
              <div className="absolute top-8 left-8 z-30">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-2xl border border-blue-400/30">
                  Active
                </span>
              </div>
            )}
          </div>

          {/* Event Content Section */}
          <div className="p-8 md:p-14 relative bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
               <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Official Event</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                    {event.title}
                  </h1>
               </div>
               
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[140px] text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Event UID</p>
                  <p className="text-sm font-mono text-slate-600 font-bold">#{id}</p>
               </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-12 pt-10 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Event Date</p>
                  <p className="text-slate-800 font-bold text-lg">{event.date || "To be announced"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-slate-800 font-bold text-lg">{event.location || "Online"}</p>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mt-12">
                <p className="text-slate-500 text-lg leading-relaxed max-w-4xl font-medium">
                  {event.description}
                </p>
              </div>
            )}

            <div className="mt-12 flex items-center gap-4 p-1 bg-slate-50 rounded-2xl w-fit pr-6 border border-slate-100">
               <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[12px] font-black text-white shadow-xl">
                 {event.created_by?.email?.charAt(0).toUpperCase()}
               </div>
               <div className="text-sm">
                  <span className="text-slate-400 font-medium">Organized by</span>
                  <span className="ml-2 text-slate-900 font-black">{event.created_by?.email}</span>
               </div>
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
