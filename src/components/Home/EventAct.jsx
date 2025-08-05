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
import useEventStore from "@/stores/event-store";
const EventAct = () => {
  const actionsGetEvents = useEventStore((state) => state.actionsGetEvents);
  const events = useEventStore((state) => state.events);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await actionsGetEvents();
    if (!res.success) setMsgError(res.message);
  };

  console.log(msgError);

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Active Events
          </h2>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {msgError ? (
            <h1 className="text-center text-red-500 col-span-full">
              {msgError}
            </h1>
          ) : (
            events.map((event, index) => (
              <Card
                key={index}
                className="px-5 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={event.image_cover}
                  alt={event.title}
                  className="rounded-mb w-full h-full object-cover"
                />

                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <div className="mt-4 space-y-2">
                    <CardDescription>
                      <Calendar className="inline-block w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.date || "ไม่ระบุ"}</span>
                    </CardDescription>
                    <CardDescription>
                      <MapPin className="inline-block w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.location || "ไม่ระบุ"}</span>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">
                    View Photos
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EventAct;
