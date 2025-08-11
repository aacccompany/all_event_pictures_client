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
import { Link } from "react-router";

const EventCard = ({ event }) => {
  return (
    <Card className="px-5 transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
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
        <Button asChild className="w-full bg-blue-700 hover:bg-blue-800">
          <Link to={`event-detail/${event.id}`}>View Photos</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
