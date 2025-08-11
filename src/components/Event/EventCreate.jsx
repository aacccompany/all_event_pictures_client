import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EventCreate = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-blue-700 hover:bg-blue-800 hover:text-white text-white" variant="outline">Create Event</Button>
        </DialogTrigger>
       
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 py-4">
            
            {/* Event Name */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="eventname">Event Name</Label>
              <Input id="eventname" name="name" placeholder="Khon Kaen Run 2025" />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {/* แก้ id ให้ตรงกับ htmlFor และเพิ่ม placeholder */}
              <Input id="location" name="location" type="text" placeholder="ริมบึงแก่นนคร" />
            </div>

            {/* Organizer Name */}
            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer Name</Label>
              <Input id="organizer" name="organizer" type="text" placeholder="John Doe Organizer" />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" />
            </div>

            {/* Categories */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="categories">Categories</Label>
              <Input id="categories" name="categories" type="text" placeholder="Sport, Marathon, Meeting, Exibition" />
            </div>

            {/* Cover Image */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="cover">Cover image</Label>
              <Input id="cover" type="file" className="file:text-foreground" />
            </div>
          </div>
          
          {/*Footer Responsive */}
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
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default EventCreate