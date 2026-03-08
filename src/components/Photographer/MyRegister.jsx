import React, { useEffect, useState } from "react";
import { Calendar, MapPin, DollarSign, Search } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    actionGetJoinedEvent(token);
  }, []);

  const filteredEvents = joinedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-start text-gray-800 mb-2">
              My Registered Events
            </h1>
            <p className="text-start text-gray-500">
              All the events you've signed up for!
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="space-y-6">
            {currentEvents.map((event, index) => (
              <div
                key={event.id || index}
                onClick={() => navigate(`/${user.role}/upload-images/${event.id}`)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col sm:flex-row items-stretch cursor-pointer"
              >
                <div className="w-full sm:w-64 md:w-72 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden">
                  <img
                    src={event.image_cover}
                    alt={`${event.title} banner`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
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
                  <div className="flex items-center text-green-600 font-semibold mt-2">
                    <DollarSign
                      size={20}
                      className="mr-2 text-green-500 flex-shrink-0"
                    />
                    <span>Earnings: ฿{(event.earnings || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/50">
                  <LeaveEvent id={event.id} />
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg sm:px-6 mt-8">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredEvents.length)}</span> of <span className="font-medium">{filteredEvents.length}</span> events
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : searchTerm ? (
          <div className="text-center bg-white p-10 rounded-lg shadow-md border border-gray-100">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">
              No results found
            </h2>
            <p className="text-gray-500 mt-2">
              We couldn't find any events matching "{searchTerm}".
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Events Found
            </h2>
            <p className="text-gray-500 mt-2">
              You haven't registered for any events yet!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegister;
