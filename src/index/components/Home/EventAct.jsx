import React from 'react';

// --- Mock Components for Demonstration ---
// In your actual project, you would import these from your UI library.

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>{children}</h3>
);

const CardDescription = ({ className, children }) => (
  <div className={`flex items-center text-sm text-gray-600 ${className}`}>{children}</div>
);

const CardFooter = ({ className, children }) => (
    <div className={`p-6 pt-0 mt-auto ${className}`}>{children}</div>
);

const Button = ({ className, children }) => (
  <button className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 ${className}`}>
    {children}
  </button>
);


// --- Mock Icons for Demonstration ---
// In your actual project, you would import these from 'lucide-react'.

const Calendar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const MapPin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);


const EventAct = () => {
    // Using an array for event data makes the component cleaner and easier to manage.
    const events = [
        {
            title: "Summer Marathon 2025",
            date: "July 15, 2025",
            location: "Central Park, New York",
            imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Marathon"
        },
        {
            title: "Tech Conference 2025",
            date: "August 22, 2025",
            location: "Moscone Center, San Francisco",
            imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Tech+Conf"
        },
        {
            title: "Music Fest",
            date: "September 5-7, 2025",
            location: "Empire Polo Club, Indio",
            imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Music+Fest"
        }
    ];

    return (
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header with responsive text alignment and padding */}
                <div className="text-center sm:text-left mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Active Events
                    </h2>
                </div>

                {/* Responsive grid for the event cards */}
                {/* 1 column on mobile, 2 on tablets, 3 on desktops */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {events.map((event, index) => (
                        <Card key={index} className="transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
                            {/* Event Image */}
                            <img 
                                src={event.imageUrl} 
                                alt={`Image for ${event.title}`} 
                                className="w-full h-48 object-cover" 
                                // Basic error handling for broken image links
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}
                            />
                            
                            {/* Card Content */}
                            <CardHeader>
                                <CardTitle>{event.title}</CardTitle>
                                <div className="mt-4 space-y-2">
                                    <CardDescription>
                                        <Calendar className="inline-block w-4 h-4 mr-2 text-gray-500" />
                                        <span>{event.date}</span>
                                    </CardDescription>
                                    <CardDescription>
                                        <MapPin className="inline-block w-4 h-4 mr-2 text-gray-500" />
                                        <span>{event.location}</span>
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            
                            {/* Card Footer with Button */}
                            <CardFooter>
                                <Button>View Photos</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Main App component to render the EventAct section
export default function App() {
    return (
        <EventAct />
    );
}
