import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';


// --- Mock Data ---
// In a real application, you would fetch this data from an API.
const initialEvents = [
  {
    id: 1,
    name: 'Tech Conference 2024',
    date: 'October 26, 2024',
    location: 'San Francisco, CA',
    imageUrl: 'https://placehold.co/600x400/3498db/ffffff?text=Tech+Conf',
  },
  {
    id: 2,
    name: 'Art & Design Expo',
    date: 'November 15, 2024',
    location: 'New York, NY',
    imageUrl: 'https://placehold.co/600x400/e74c3c/ffffff?text=Art+Expo',
  },
  {
    id: 3,
    name: 'Music Fest',
    date: 'December 5, 2024',
    location: 'Austin, TX',
    imageUrl: 'https://placehold.co/600x400/9b59b6/ffffff?text=Music+Fest',
  },
  {
    id: 4,
    name: 'Startup Pitch Night',
    date: 'December 20, 2024',
    location: 'Online',
    imageUrl: 'https://placehold.co/600x400/1abc9c/ffffff?text=Pitch+Night',
  },
];

// --- Event List Item Component ---
// This component displays a single event in a row format.
const EventListItem = ({ event, onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl flex flex-col sm:flex-row items-center">
      <img 
        src={event.imageUrl} 
        alt={`${event.name} banner`} 
        className="w-full sm:w-48 h-48 sm:h-full object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400/cccccc/ffffff?text=Image+Error'; }}
      />
      <div className="p-6 flex-grow w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <Calendar size={20} className="mr-2 text-gray-500 flex-shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin size={20} className="mr-2 text-gray-500 flex-shrink-0" />
          <span>{event.location}</span>
        </div>
      </div>
      <div className="p-6 w-full sm:w-auto">
          <button 
            onClick={() => onCancel(event.id)}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Cancel Registration
          </button>
      </div>
    </div>
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
