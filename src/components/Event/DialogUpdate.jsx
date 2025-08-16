import React, { useEffect, useState } from "react";
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
import { create_event, get_event, update_event } from "@/api/event";
import UploadImageCover from "./UploadImageCover";
import { upload_image_cover } from "@/api/uploadimage";
import { Loader2 } from "lucide-react";
import useEventStore from "@/stores/event-store";

const DialogUpdate = ({id }) => {
  const token = useAuthStore((state) => state.token);
  const actionsGetEvents = useEventStore((state) => state.actionsGetEvents)
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents)
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (openDialog) handleGetEvent(id);
  }, [openDialog, id]);

  const handleGetEvent = async () => {
    try {
      const res = await get_event(id);
      setData(res.data);
      setOriginalData(res.data); // เก็บค่าเดิม
    } catch (error) {
      console.log(error);
    }
  };

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

      await update_event(token, id, {
        ...data,
        ...imageData,
      });

      setOriginalData({ ...data, ...imageData }); // อัปเดตค่าเดิมเป็นล่าสุด
      await actionsGetEvents();
      await actionGetMyEvents(token)
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open) => {
    if (!open) {
      setData(originalData); // ถ้าปิดโดยไม่ Save ให้ revert กลับ
      setImageFile(null);
    }
    setOpenDialog(open);
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-700 hover:bg-purple-900 hover:text-white text-white"
          variant="outline"
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Event</DialogTitle>
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
                value={data.title}
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
                value={data.location}
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
                value={data.date}
                onChange={handleOnChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="active"
                value={String(data.active)}
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

            {/* description */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                type="text"
                placeholder="lorem ipsum"
                value={data.description}
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

export default DialogUpdate;
