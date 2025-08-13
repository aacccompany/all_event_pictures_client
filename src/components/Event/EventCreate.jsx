import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/auth-store";
import { create_event } from "@/api/event";

const EventCreate = () => {
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState({});

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      await create_event(token, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-700 hover:bg-blue-800 hover:text-white text-white"
          variant="outline"
        >
          Create Event
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 py-4">
            {/* Event Name */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="eventname">Event Name</Label>
              <Input
                id="title"
                name="title"
                placeholder="Khon Kaen Run 2025"
                onChange={handleOnChange}
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="ริมบึงแก่นนคร"
                onChange={handleOnChange}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                onChange={handleOnChange}
              />
            </div>

            {/* location */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                type="text"
                placeholder="lorem ipsum"
                onChange={handleOnChange}
              />
            </div>

            {/* Cover Image */}
            {/* <div className="md:col-span-2 space-y-2">
              <Label htmlFor="image_cover">Cover image</Label>
              <Input
                id="image_cover"
                name="image_cover"
                type="file"
                className="file:text-foreground"
                onChange={handleOnChange}
              />
            </div> */}
          </div>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Discard
              </Button>
            </DialogClose>
            <Button className="bg-blue-700 hover:bg-blue-800" type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>

        {/*Footer Responsive */}
      </DialogContent>
    </Dialog>
  );
};

export default EventCreate;
