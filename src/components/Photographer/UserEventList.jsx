import React from 'react';
import { CalendarDays } from 'lucide-react';

// Mock data for the events. In a real application, this would likely come from an API.
const eventsData = [
  {
    id: 1,
    title: 'AI FOR ALL 2024',
    description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts.',
    date: '15 MAY 2024',
    time: '17:00-21:00',
    imageUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=AI+Event',
    status: 'Available',
  },
  {
    id: 2,
    title: 'Future of Web Development',
    description: 'Join us for a deep dive into the next generation of web technologies, from serverless functions to edge computing.',
    date: '22 JUN 2024',
    time: '09:00-17:00',
    imageUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Web+Dev',
    status: 'Available',
  },
  {
    id: 3,
    title: 'Advanced Design Systems',
    description: 'A hands-on workshop for designers and developers looking to build scalable and maintainable design systems.',
    date: '18 JUL 2024',
    time: '10:00-16:00',
    imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Design+Talk',
    status: 'Available',
  },
];

// Event Card Component - Updated to a horizontal layout
const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row items-center ">
      {/* Event Image (Left) */}
      <img className="w-full h-48 sm:w-48 px-1 sm:h-full object-cover flex-shrink-0" src={event.imageUrl} alt={event.title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }} />
      
      {/* Text Content (Middle) */}
      <div className="flex-grow p-6 text-center sm:text-left">
        <div>
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {event.status}
          </span>
        </div>
        
        <h3 className="mt-2 text-xl font-bold text-gray-900">{event.title}</h3>
        
        <p className="mt-2 text-sm text-gray-600 hidden md:block">{event.description}</p>
        
        <div className="mt-4 flex items-center justify-center sm:justify-start text-sm text-gray-500">
           <CalendarDays className="h-5 w-5 mr-1.5 text-gray-400" />
           <span>{event.date} at {event.time}</span>
        </div>
      </div>
      
      {/* Register Button (Right) */}
      <div className="p-6 pt-0 sm:pt-6 sm:px-6 flex-shrink-0">
         <button className="w-full sm:w-auto bg-blue-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300">
            Register
        </button>
      </div>
    </div>
  );
};


const UserEventList = () => {
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
          {eventsData.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserEventList;
