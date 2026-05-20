import useEventStore from "@/stores/event-store";
import DialogUpdate from "./DialogUpdate";
import EventDelete from "./EventDelete";
import EventPhotographerListModal from "./PhotographerListModal";
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/auth-store";
import { Link } from "react-router";
import { Image as ImageIcon, Users, Loader2 } from "lucide-react";
import { get_event_photographers } from "@/api/event_user";

const EventTable = () => {
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents);
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents);
  const events = useEventStore((state) => state.events);
  const myEvents = useEventStore((state) => state.myEvents);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [photographerCounts, setPhotographerCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPhotographerModal, setShowPhotographerModal] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'super-admin';

  useEffect(() => {
    actionGetEvents();
    actionGetMyEvents(token);
  }, []);

  // Fetch photographer counts for all events
  useEffect(() => {
    if (!token || (!events.length && !myEvents.length)) return;

    const eventsToFetch = user?.role === "super-admin" ? events : myEvents;
    const fetchPhotographerCounts = async () => {
      const newCounts = {};
      const newLoadingStates = {};

      for (const event of eventsToFetch) {
        newLoadingStates[event.id] = true;
        try {
          const res = await get_event_photographers(event.id, token);
          newCounts[event.id] = res.data?.length || 0;
        } catch (error) {
          console.error(`Error fetching photographers for event ${event.id}:`, error);
          newCounts[event.id] = 0;
        } finally {
          newLoadingStates[event.id] = false;
        }
      }

      setPhotographerCounts(newCounts);
      setLoadingCounts(newLoadingStates);
    };

    fetchPhotographerCounts();
  }, [events, myEvents, token, user?.role]);

  const handleOpenPhotographerModal = (event) => {
    setSelectedEvent(event);
    setShowPhotographerModal(true);
  };

  const handleClosePhotographerModal = () => {
    setShowPhotographerModal(false);
    setSelectedEvent(null);
  };

  const renderRow = (event, index) => {
    const photographerCount = photographerCounts[event.id] || 0;
    const isLoadingCount = loadingCounts[event.id];

    return (
      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {event.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {event.date}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
              ${event.active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-500"
              }`}
          >
            {event.active ? "Active" : "Close"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
        ${event.event_type === "Public" ? " text-green-600" : " text-red-500"}`}
          >
            {event.event_type}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {event.location}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {event.limit || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {event.created_by?.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          <button
            onClick={() => handleOpenPhotographerModal(event)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:hover:bg-indigo-50"
            disabled={isLoadingCount}
          >
            <Users className="w-4 h-4" />
            {isLoadingCount ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <span className="font-semibold">{photographerCount}</span>
            )}
          </button>
        </td>
        <td>
          <div className="flex justify-center items-center gap-2">
            <Link
              to={user?.role === "super-admin" ? `/super-admin/manage-event/${event.id}` : `/org/manage-event/${event.id}`}
              title="Manage Images"
              className="p-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </Link>
            <DialogUpdate id={event.id} />
            <EventDelete id={event.id} title={event.title} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <main className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Event Overview</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ">
                  Event Name
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographers
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {user?.role === "super-admin" &&
                events.map((event, index) => renderRow(event, index))}
              {user?.role === "admin" &&
                myEvents.map((event, index) => renderRow(event, index))}
            </tbody>
          </table>

          {/* Photographer List Modal */}
          {selectedEvent && (
            <EventPhotographerListModal
              eventId={selectedEvent.id}
              eventTitle={selectedEvent.title}
              isOpen={showPhotographerModal}
              onClose={handleClosePhotographerModal}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EventTable;
