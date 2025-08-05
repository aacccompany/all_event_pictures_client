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
import { get_active_events } from "@/api/event";

const EventAll = () => {
  const [events, setEvents] = useState([]);
  const [msgError, setMagError] = useState("");

  useEffect(() => {
    handleGetEvents();
  }, []);

  const handleGetEvents = async () => {
    try {
      const res = await get_active_events();
      setEvents(res.data);
    } catch (err) {
      setMagError(err.response?.data?.detail || "Event fail");
      console.log(err);
    }
  };

  console.log(events);
  return (
    <section className="bg-gray-100 py-16 sm:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            All Events
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Browse our collection of past and upcoming events.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {msgError ? (
          <h1 className="text-center text-red-500 col-span-full">{msgError}</h1>
        ) : (
          events.map((event, index) => (
            <div className="px-10">
              <Card
                key={index}
                className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={event.image_cover}
                    alt={event.title}
                    className="w-full object-cover"
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
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">View Photos</Button>
                </CardFooter>
              </Card>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default EventAll;
