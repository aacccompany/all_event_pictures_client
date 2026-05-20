import React, { useState, useEffect } from "react";
import { X, Users, Camera, Mail, Loader2 } from "lucide-react";
import { get_event_photographers } from "@/api/event_user";
import { toast } from "sonner";
import useAuthStore from "@/stores/auth-store";

const EventPhotographerListModal = ({ eventId, eventTitle, isOpen, onClose }) => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (isOpen && eventId) {
      fetchPhotographers();
    }
  }, [isOpen, eventId]);

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      const res = await get_event_photographers(eventId, token);
      setPhotographers(res.data || []);
    } catch (error) {
      console.error("Error fetching photographers:", error);
      toast.error("Failed to load photographers");
      setPhotographers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Event Photographers</h3>
                <p className="text-sm text-gray-500">{eventTitle || 'Event'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : photographers.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No photographers assigned to this event</p>
            </div>
          ) : (
            <div className="space-y-3">
              {photographers.map((photographer) => {
                const user = photographer.user || {};
                return (
                  <div
                    key={photographer.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.email?.split('@')[0] || 'User'}
                        }
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: #{user.id}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {photographers.length} photographer{photographers.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPhotographerListModal;
