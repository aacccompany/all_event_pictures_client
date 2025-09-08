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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/stores/auth-store";
import { create_event } from "@/api/event";
import UploadImageCover from "./UploadImageCover";
import { upload_image_cover } from "@/api/uploadimage";
import { Loader2 } from "lucide-react";
import useEventStore from "@/stores/event-store";

const EventCreate = () => {
  const token = useAuthStore((state) => state.token);
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents);
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents);
  const [data, setData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let imageData = {};
      if (imageFile) {
        const formData = new FormData();
        formData.append("image_cover", imageFile);
        const res = await upload_image_cover(token, formData);
        imageData = {
          image_cover: res.data.secure_url,
          public_id: res.data.public_id,
        };
      }

      // if (data.event_type === "Private") delete data.limit;

      await create_event(token, {
        ...data,
        ...imageData,
      });
      await actionGetEvents();
      await actionGetMyEvents(token);
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
                placeholder="Location"
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

            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <Select
                name="event_type"
                onValueChange={(value) =>
                  setData({
                    ...data,
                    event_type: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="active"
                onValueChange={(val) =>
                  setData({
                    ...data,
                    active: val === "true",
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Close</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {data.event_type === "Public" && (
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="count">Registration Limit</Label>
                <Input
                  id="limit"
                  name="limit"
                  type="number"
                  placeholder="Max number of registrations"
                  onChange={handleOnChange}
                />
              </div>
            )}

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
            <div className="md:col-span-2 space-y-2">
              <UploadImageCover setImageFile={setImageFile} />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Discard
              </Button>
            </DialogClose>
            {isSubmitting ? (
              <Button type="button" disabled className="gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button className="bg-blue-700 hover:bg-blue-800" type="submit">
                Save
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreate;
