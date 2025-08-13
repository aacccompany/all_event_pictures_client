import React from "react";
import EventCreate from "./EventCreate";
import EventTable from "./EventTable";

const eventsData = [
  {
    id: 1,
    name: "KK Run 2025",
    date: "2025-12-15",
    status: "Active",
    revenue: "112,000 THB",
    photographers: "Phutanet Dek Nerd",
  },
  {
    id: 2,
    name: "KK Night Run",
    date: "2025-11-09",
    status: "Closed",
    revenue: "86,400 THB",
    photographers: "Flixshot Creation",
  },
  {
    id: 3,
    name: "KK Long Run",
    date: "2025-11-09",
    status: "Closed",
    revenue: "90,000THB",
    photographers: "Flixshot Creation",
  },
  {
    id: 3,
    name: "KK Mini Marathon",
    date: "2025-11-09",
    status: "Active",
    revenue: "200,000 THB",
    photographers: "Phutanet Dek Dum",
  },
];

const EventCreateContainer = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/*Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your organized events
            </p>
          </div>
          <EventCreate />
        </header>
        <EventTable />
      </div>
    </div>
  );
};

export default EventCreateContainer;
