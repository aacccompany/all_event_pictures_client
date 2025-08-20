import React, { useEffect } from "react";
import EventCreate from "./EventCreate";
import EventTable from "./EventTable";
import useEventStore from "@/stores/event-store";
import useAuthStore from "@/stores/auth-store";

const EventCreateContainer = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      
        {/*Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="mt-1 text-sm text-gray-600">Manage Your Events</p>
          </div>
          <EventCreate />
        </header>
        <EventTable/>
     
    </div>
  );
};

export default EventCreateContainer;
