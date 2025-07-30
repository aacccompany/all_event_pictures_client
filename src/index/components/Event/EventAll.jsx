import React from 'react';

// --- Mock Components for Demonstration ---
// In a real project, you would import these from your UI library (e.g., shadcn/ui).

const Card = ({ className, children }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`p-5 flex-grow ${className}`}>{children}</div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-xl font-bold text-gray-900 leading-tight ${className}`}>{children}</h3>
);

const CardDescription = ({ className, children }) => (
  <div className={`flex items-center text-sm text-gray-600 ${className}`}>{children}</div>
);

const CardFooter = ({ className, children }) => (
    <div className={`p-5 pt-0 ${className}`}>{children}</div>
);

const Button = ({ className, children }) => (
  <button className={`w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ${className}`}>
    {children}
  </button>
);


// --- Mock Icons for Demonstration ---
// In a real project, you would import these from 'lucide-react'.

const Calendar = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

const MapPin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);


const EventAll = () => {
    // Using an array for event data makes the component cleaner, scalable, and easier to manage.
    const events = [
        {
            title: "Summer Marathon 2025",
            date: "July 15, 2025",
            location: "Central Park, New York",
            imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Marathon"
        },
        {
            title: "Winter Arts Festival",
            date: "December 20, 2024",
            location: "Millennium Park, Chicago",
            imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Art+Festival"
        },
        {
            title: "Spring Tech Summit",
            date: "March 10, 2025",
            location: "Convention Center, Austin",
            imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Tech+Summit"
        },
        {
            title: "Autumn Food Fair",
            date: "October 5, 2024",
            location: "Pike Place Market, Seattle",
            imageUrl: "https://placehold.co/600x400/f39c12/ffffff?text=Food+Fair"
        },
         {
            title: "International Film Fest",
            date: "November 12, 2024",
            location: "TIFF Bell Lightbox, Toronto",
            imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Film+Fest"
        },
        {
            title: "New Year's Gala",
            date: "December 31, 2024",
            location: "Sydney Opera House, Sydney",
            imageUrl: "https://placehold.co/600x400/1abc9c/ffffff?text=Gala"
        }
    ];

    return (
        <section className="bg-gray-100 py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
                        All Events
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-gray-600">
                        Browse our collection of past and upcoming events.
                    </p>
                </div>

                {/* Responsive grid for the event cards */}
                {/* 1 column on mobile, 2 on tablets, and 3 on desktops */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {events.map((event, index) => (
                        <Card key={index} className="transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl">
                            {/* Event Image */}
                            <div className="aspect-w-16 aspect-h-9">
                                <img 
                                    src={event.imageUrl} 
                                    alt={`Promotional image for ${event.title}`} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Missing'; }}
                                />
                            </div>
                            
                            {/* Card Content: flex-grow allows this section to fill available space */}
                            <CardHeader>
                                <CardTitle>{event.title}</CardTitle>
                                <div className="mt-3 space-y-2">
                                    <CardDescription>
                                        <Calendar className="w-4 h-4 mr-2.5 text-gray-500 flex-shrink-0" />
                                        <span>{event.date}</span>
                                    </CardDescription>
                                    <CardDescription>
                                        <MapPin className="w-4 h-4 mr-2.5 text-gray-500 flex-shrink-0" />
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

// Main App component to render the EventAll section
export default function App() {
    return (
        <EventAll />
    );
}
