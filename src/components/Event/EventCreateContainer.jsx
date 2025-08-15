import React, { useEffect } from "react";
import EventCreate from "./EventCreate";
import EventTable from "./EventTable";
import useEventStore from "@/stores/event-store";

const EventCreateContainer = () => {
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents);

  useEffect(() => {
    actionGetEvents();
  }, []);
  
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/*Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage Your Events
            </p>
          </div>
          <EventCreate actionGetEvents={actionGetEvents}/>
        </header>
        <EventTable />
      </div>
    </div>
  );
};

export default EventCreateContainer;
