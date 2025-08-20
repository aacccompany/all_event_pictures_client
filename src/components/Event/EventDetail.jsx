import React, { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { useParams } from "react-router";
import { get_event } from "@/api/event";
import SearchFace from "./SearchFace";
import EventPhoto from "./EventPhoto";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { UploadIcon } from "lucide-react";


const EventDetail = () => {
  const [event, setEvent] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchEvent(id);
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await get_event(id);
      setEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* --- Section 1: Event Header --- */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                active
              </span>
            </div>
            <p className="text-sm text-gray-500">Event ID: {id}</p>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {event.title}
            </h1>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-gray-700 leading-relaxed max-w-3xl">
              {event.description}
            </p>
          </div>
          <div className="mt-5 text-sm text-gray-500">
            Organized by {event.created_by?.email}
          </div>
        </section>

        <Card className="w-full gap-3 mt-7">
          <CardHeader>
            <CardTitle className="text-blue-700">Upload Images</CardTitle>
            <CardDescription>Select multiple images to upload.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid gap-2">
                <Input id="images" type="file" multiple />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-900">Upload</Button>
          </CardFooter>
        </Card>


        {/* --- Section 2: Search by Face --- */}
        <SearchFace />

        {/* --- Section 3: All Event Photos --- */}
        <EventPhoto event={event} />
      </div>
    </div>
  );
};

export default EventDetail;
