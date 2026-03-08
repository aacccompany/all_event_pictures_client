import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ManageImages from "@/components/ManageImage/ManageImages";
import { get_event } from "@/api/event";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";

const ManageEventImages = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await get_event(id);
                setEvent(res.data);
            } catch (error) {
                console.error("Failed to load event details", error);
            }
        };
        fetchEvent();
    }, [id]);

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to events management
                </button>

                {/* Event Header */}
                {event && (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                                Event Management
                            </span>
                            <p className="text-sm text-gray-500">ID: {event.id}</p>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{event.location}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Images Component */}
                <ManageImages eventId={id} />
            </div>
        </div>
    );
};

export default ManageEventImages;
