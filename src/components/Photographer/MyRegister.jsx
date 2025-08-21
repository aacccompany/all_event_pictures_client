import useEventStore from "@/stores/event-store";
import { useEffect } from "react";
import EventEmpty from "../Home/EventEmpty";
import EventCard from "../Home/EventCard";

const MyRegister = () => {
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
                    My Event
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

// --- Main Page Component ---
// This component displays the list of all registered events.
const MyRegister = () => {
  const [registeredEvents, setRegisteredEvents] = useState(initialEvents);

  // Function to handle canceling a registration
  const handleCancelRegistration = (eventId) => {
    setRegisteredEvents(currentEvents => 
      currentEvents.filter(event => event.id !== eventId)
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-start text-gray-800 mb-4">My Registered Events</h1>
        <p className="text-start text-gray-500 mb-12">All the events you've signed up.!</p>
        
        {registeredEvents.length > 0 ? (
          <div className="space-y-6">
            {registeredEvents.map(event => (
              <EventListItem 
                key={event.id} 
                event={event} 
                onCancel={handleCancelRegistration} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">No Events Found</h2>
            <p className="text-gray-500 mt-2">You haven't registered for any events yet.!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegister;
