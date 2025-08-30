import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import useAuthStore from "@/stores/auth-store";
import LeaveEvent from "./LeaveEvent";
import useEventStore from "@/stores/event-store";
import { useNavigate } from "react-router";

const MyRegister = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user)
  const actionGetJoinedEvent = useEventStore(
    (state) => state.actionGetJoinedEvent
  );
  const joinedEvents = useEventStore((state) => state.joinedEvents);
  const navigate = useNavigate();

  useEffect(() => {
    actionGetJoinedEvent(token);
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-start text-gray-800 mb-4">
          My Registered Events
        </h1>
        <p className="text-start text-gray-500 mb-12">
          All the events you've signed up.!
        </p>

        {joinedEvents.length > 0 ? (
          <div className="space-y-6">
            {joinedEvents.map((event, index) => (
              <div
                key={index}
                onClick={() => navigate(`/${user.role}/upload-images/${event.id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col sm:flex-row items-center cursor-pointer"
              >
                <img
                  src={event.image_cover}
                  alt={`${event.title} banner`}
                  className="w-full sm:w-48 h-48 sm:h-full object-cover"
                />
                <div onClick={() => event.id} className="p-6 flex-grow w-full">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar
                      size={20}
                      className="mr-2 text-gray-500 flex-shrink-0"
                    />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin
                      size={20}
                      className="mr-2 text-gray-500 flex-shrink-0"
                    />
                    <span>{event.location}</span>
                  </div>
                </div>
                <LeaveEvent id={event.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Events Found
            </h2>
            <p className="text-gray-500 mt-2">
              You haven't registered for any events yet.!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegister;
