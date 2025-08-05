import React, { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { get_events } from "@/api/event";

const EventAll = () => {
  const [events, setEvents] = useState([]);
  const [msgError, setMagError] = useState("")

  useEffect(() => {
    handleGetEvents();
  }, []);

  const handleGetEvents = async () => {
    try {
      const res = await get_events();
      setEvents(res.data);
    } catch (err) {
      setMagError(err.response?.data?.detail || "Event fail")
      console.log(err)
    }
  };

  console.log(msgError)

  console.log(events);
  return (
    <section className="bg-gray-100 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            All Events
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Browse our collection of past and upcoming events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <Card
              key={idx}
              className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={event.image_cover}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  
                />
              </div>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <CardDescription className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {event.date}
                  </CardDescription>
                  <CardDescription className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {event.location}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter>
                <Button>View Photos</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
      </div>
      <h1>{msgError}</h1>
    </section>
  );
};

export default EventAll;

// const events = [
//   {
//     title: "Summer Marathon 2025",
//     date: "July 15, 2025",
//     location: "Central Park, New York",
//     imageUrl: "https://placehold.co/600x400/3498db/ffffff?text=Marathon",
//   },
//   {
//     title: "Winter Arts Festival",
//     date: "December 20, 2024",
//     location: "Millennium Park, Chicago",
//     imageUrl: "https://placehold.co/600x400/e74c3c/ffffff?text=Art+Festival",
//   },
//   {
//     title: "Spring Tech Summit",
//     date: "March 10, 2025",
//     location: "Convention Center, Austin",
//     imageUrl: "https://placehold.co/600x400/2ecc71/ffffff?text=Tech+Summit",
//   },
//   {
//     title: "Autumn Food Fair",
//     date: "October 5, 2024",
//     location: "Pike Place Market, Seattle",
//     imageUrl: "https://placehold.co/600x400/f39c12/ffffff?text=Food+Fair",
//   },
//   {
//     title: "International Film Fest",
//     date: "November 12, 2024",
//     location: "TIFF Bell Lightbox, Toronto",
//     imageUrl: "https://placehold.co/600x400/9b59b6/ffffff?text=Film+Fest",
//   },
//   {
//     title: "New Year's Gala",
//     date: "December 31, 2024",
//     location: "Sydney Opera House, Sydney",
//     imageUrl: "https://placehold.co/600x400/1abc9c/ffffff?text=Gala",
//   },
// ];
