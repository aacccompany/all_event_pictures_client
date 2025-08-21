import useEventStore from "@/stores/event-store";
import DialogUpdate from "./DialogUpdate";
import EventDelete from "./EventDelete";
import { useEffect } from "react";
import useAuthStore from "@/stores/auth-store";

const EventTable = () => {
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents);
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents);
  const events = useEventStore((state) => state.events);
  const myEvents = useEventStore((state) => state.myEvents);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    actionGetEvents();
    actionGetMyEvents(token);
  }, []);

  const renderRow = (event, index) => (
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
            ${
              event.active
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
      <td>
        <div className="flex justify-center">
          <DialogUpdate id={event.id} />
          <EventDelete id={event.id} title={event.title} />
        </div>
      </td>
    </tr>
  );

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
        </div>
      </main>
    </div>
  );
};

export default EventTable;
