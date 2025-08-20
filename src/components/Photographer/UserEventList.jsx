  import React, { useEffect } from "react";
  import { CalendarDays } from "lucide-react";
  import useEventStore from "@/stores/event-store";

  const UserEventList = () => {
    const activeEvents = useEventStore((state) => state.activeEvents);
    const actionsGetActiveEvents = useEventStore(
      (state) => state.actionsGetActiveEvents
    );

    useEffect(() => {
      actionsGetActiveEvents();
    }, []);

    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events list</h1>
              <p className="mt-1 text-sm text-gray-600">Register Events</p>
            </div>
          </header>

          {/* Events List (changed from Grid to Flex Column) */}
          <div className="mt-5 flex flex-col gap-2">
            {activeEvents.map((event) => (
              <div className="bg-white p-5 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row items-center transition-transform duration-300 hover:scale-101">
                <img
                  className="w-full rounded-lg h-48 sm:w-82 sm:h-full object-cover flex-shrink-0"
                  src={event.image_cover}
                  alt={event.title}
                />
                <div className="flex-grow p-6 text-center sm:text-left">
                  <div>
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        event.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {event.active ? "Active" : "Close"}
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
                <div className="p-6 pt-0 sm:pt-6 sm:px-6 flex-shrink-0">
                  <button className="w-full sm:w-auto bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-900 transition-colors duration-300">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default UserEventList;
