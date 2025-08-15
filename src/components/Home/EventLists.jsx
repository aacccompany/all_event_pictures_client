import useEventStore from "@/stores/event-store";
import EventEmpty from "./EventEmpty";
import EventCard from "./EventCard";
import { useEffect } from "react";

const EventLists = () => {
  const actionsGetActiveEvents = useEventStore(
    (state) => state.actionsGetActiveEvents
  );
  useEffect(() => {
    actionsGetActiveEvents();
  }, []);
  const activeEvents = useEventStore((state) => state.activeEvents);
  if (activeEvents.length === 0) return <EventEmpty />;


  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-10">
          Active Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeEvents.map((item, index) => {
            return <EventCard key={index} event={item} />;
          })}
        </div>
      </div>
    </section>
  );
};
export default EventLists;
