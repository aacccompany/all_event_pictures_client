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
import InviteEvent from "../Form/InviteEvent";
import { invite_event } from "@/api/event_user";
import { toast } from "sonner";

const DialogUpdate = ({ id }) => {
  const token = useAuthStore((state) => state.token);
  const actionsGetEvents = useEventStore((state) => state.actionsGetEvents);
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents);
  const [data, setData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);

  const handleInvite = async () => {
    if (emails.length === 0) return true;
    try {
      await invite_event(token, id, { user_emails: emails });
      toast.success("Invite sent successfully");
      return true; // success
    } catch (error) {
      const msgErr = error.response?.data?.detail || "Invite fail";
      toast.warning(msgErr);
      console.log(error);
      return false; // fail
    }
  };

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
    if (data.event_type === "Private" && email.trim() !== "") {
      toast.warning("Please press Enter to add email before saving");
      return;
    }

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

      if (data.event_type === "Private") delete data.limit;

      await update_event(token, id, {
        ...data,
        ...imageData,
      });

      let inviteSuccess = true;
      if (data.event_type === "Private") {
        inviteSuccess = await handleInvite();
      }

      if (inviteSuccess) {
        setOriginalData({ ...data, ...imageData });
        await actionsGetEvents();
        await actionGetMyEvents(token);
        setEmails([]);
        setEmail("");
        setOpenDialog(false);
        toast.success("Update successfully");
      }
    } catch (error) {
      const msgErr = error.response?.data?.detail || "Update fail";
      toast.warning(msgErr);
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open) => {
    if (!open) {
      setData(originalData);
      setImageFile(null);
      setEmails([]);
      setEmail("");
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
          Details
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
              <Label htmlFor="event_type">Event Type</Label>
              <Select
                name="event_type"
                value={data.event_type}
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

            {data.event_type === "Public" && (
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="count">Registration Limit</Label>
                <Input
                  id="limit"
                  name="limit"
                  type="number"
                  placeholder="Max number of registrations"
                  value={data.limit}
                  onChange={handleOnChange}
                />
              </div>
            )}

            <div className="md:col-span-2 space-y-2">
              {data.event_type === "Private" && (
                <div>
                  <Label>Invite</Label>
                  <div className="flex gap-2">
                    <Input
                      id="user_emails"
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (email && !emails.includes(email)) {
                            setEmails([...emails, email]);
                            setEmail("");
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Email list as tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {emails.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() =>
                            setEmails(emails.filter((em) => em !== item))
                          }
                          className="ml-1 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
