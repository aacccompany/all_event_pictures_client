import React, { useEffect, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import useEventStore from "@/stores/event-store";
import RegisterEvent from "./RegisterEvent";

const UserEventList = () => {
  const activeEvents = useEventStore((state) => state.activeEvents);
  const actionsGetActiveEvents = useEventStore(
    (state) => state.actionsGetActiveEvents
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    actionsGetActiveEvents();
  }, []);

  const filteredEvents = activeEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const visibleEvents = filteredEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events list</h1>
            <p className="mt-1 text-sm text-gray-600">Browse and Register for Events</p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(10); // Reset visible count on search
              }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </header>

        {/* Events List */}
        {filteredEvents.length > 0 ? (
          <div className="mt-5 flex flex-col gap-4">
            {visibleEvents.map((event, index) => (
              <div
                key={event.id || index}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row items-stretch transition-all duration-300 hover:shadow-md"
              >
                <div className="w-full sm:w-64 md:w-72 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none">
                  <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src={event.image_cover}
                    alt={event.title}
                  />
                </div>
                <div className="flex-grow p-6 text-center sm:text-left">
                  <div>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${event.event_type === "Private"
                          ? "bg-red-100 text-red-500"
                          : "bg-green-100 text-green-800"
                        }`}
                    >
                      {event.event_type === "Private" ? "Private" : "Public"}
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600 hidden md:block">
                    {event.description}
                  </p>

                  <div className="mt-4 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                    <CalendarDays className="h-5 w-5 mr-1.5 text-gray-400" />
                    <span>{event.date}</span>
                  </div>
                </div>
                <RegisterEvent id={event.id} event_type={event.event_type} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-sm border border-gray-100 mt-5">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">
              No events found
            </h2>
            <p className="text-gray-500 mt-2">
              We couldn't find any events matching "{searchTerm}".
            </p>
          </div>
        )}

        {visibleCount < filteredEvents.length && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEventList;
