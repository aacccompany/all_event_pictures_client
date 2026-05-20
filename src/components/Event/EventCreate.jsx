import React, { useState, useEffect } from "react";
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
import { getUsers } from "@/api/super-admin";
import { add_photographer_to_event } from "@/api/event_user";
import UploadImageCover from "./UploadImageCover";
import { upload_image_cover } from "@/api/uploadimage";
import { Loader2, Users, ChevronDown, ChevronUp, Check } from "lucide-react";
import useEventStore from "@/stores/event-store";
import { toast } from "sonner";

// TODO: Google Maps integration - Uncomment when needed
// const DEFAULT_CENTER = { lat: 13.7563, lng: 100.5018 };
// const loadGoogleMapsScript = () => { ... };

const EventCreate = () => {
  const token = useAuthStore((state) => state.token);
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents);
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents);
  const [data, setData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photographer selection states
  const [availablePhotographers, setAvailablePhotographers] = useState([]);
  const [selectedPhotographers, setSelectedPhotographers] = useState([]);
  const [loadingPhotographers, setLoadingPhotographers] = useState(false);
  const [showPhotographerSection, setShowPhotographerSection] = useState(false);

  // Fetch available photographers when dialog opens
  useEffect(() => {
    if (openDialog) {
      fetchPhotographers();
    }
  }, [openDialog]);

  const fetchPhotographers = async () => {
    try {
      setLoadingPhotographers(true);
      const res = await getUsers(token, 1, 100, false, 'user');
      const users = res.data?.users || res.data || [];
      setAvailablePhotographers(users);
    } catch (error) {
      console.error("Error fetching photographers:", error);
      toast.error("Failed to load photographers");
    } finally {
      setLoadingPhotographers(false);
    }
  };

  const togglePhotographer = (userId) => {
    setSelectedPhotographers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // TODO: Google Maps integration - Uncomment when needed
  // const [showMapPicker, setShowMapPicker] = useState(false);
  // const [mapLoaded, setMapLoaded] = useState(false);
  // const mapRef = useRef(null);
  // const markerRef = useRef(null);

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // TODO: Google Maps integration - Uncomment when map functionality is needed
  /*
  const initializeMap = () => {
    if (mapRef.current) return;

    const map = new window.google.maps.Map(document.getElementById("google-map"), {
      center: DEFAULT_CENTER,
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    mapRef.current = map;

    // Add click listener to place marker
    map.addListener("click", (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
      });

      markerRef.current = marker;

      // Reverse geocode to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;
          setData({ ...data, location: address, latitude: lat, longitude: lng });
        }
      });
    });
  };

  const openMapPicker = async () => {
    setShowMapPicker(true);
    if (!mapLoaded) {
      try {
        await loadGoogleMapsScript();
        setMapLoaded(true);
        // Small delay to ensure Google Maps is ready
        setTimeout(initializeMap, 500);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        // Fallback: use Leaflet or simple coordinate input
      }
    } else {
      setTimeout(initializeMap, 100);
    }
  };

  const handleMapSelect = () => {
    if (markerRef.current) {
      const position = markerRef.current.getPosition();
      const lat = position.lat();
      const lng = position.lng();

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;
          setData({
            ...data,
            location: address,
            latitude: lat,
            longitude: lng
          });
          setShowMapPicker(false);
        }
      });
    }
  };
  */

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

      const response = await create_event(token, {
        ...data,
        ...imageData,
      });

      const newEventId = response.data.id;

      // Add selected photographers to the event
      if (selectedPhotographers.length > 0) {
        await Promise.all(
          selectedPhotographers.map(userId =>
            add_photographer_to_event(newEventId, token, userId)
          )
        );
        toast.success(`Event created with ${selectedPhotographers.length} photographer(s)`);
      } else {
        toast.success("Event created successfully");
      }

      await actionGetEvents();
      await actionGetMyEvents(token);
      setOpenDialog(false);

      // Reset form
      setData({});
      setImageFile(null);
      setSelectedPhotographers([]);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.detail || "Failed to create event");
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

            {/* Location - Simple text field for now */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="e.g., Bangkok, Khon Kaen, Phuket"
                value={data.location || ""}
                onChange={handleOnChange}
              />
              <p className="text-xs text-gray-500">Enter the event location name</p>

              {/* TODO: Google Maps integration - Uncomment to enable map picker
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Click map to select location"
                    value={data.location || ""}
                    onChange={handleOnChange}
                    readOnly
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={openMapPicker}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Select on Map
                </Button>
              </div>
              {data.latitude && data.longitude && (
                <p className="text-xs text-gray-500">
                  📍 Coordinates: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                </p>
              )}
              */}
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

            {/* Image Price Option */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="price_type">Download Type</Label>
              <Select
                name="price_type"
                value={data.image_price === 0 ? "free" : "paid"}
                onValueChange={(value) => {
                  const isFree = value === "free";
                  setData({
                    ...data,
                    image_price: isFree ? 0 : 2000, // Default to 20 THB if paid
                  });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select download type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free"> Free Download</SelectItem>
                  <SelectItem value="paid"> Paid Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Price (THB) - Only show when paid */}
            {data.image_price > 0 && (
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="image_price_thb">Price per Image (THB)</Label>
                <Input
                  id="image_price_thb"
                  name="image_price_thb"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="20.00"
                  value={typeof data.image_price === "number" ? (data.image_price / 100).toFixed(2) : "20.00"}
                  onChange={(e) => {
                    const thb = parseFloat(e.target.value || "0");
                    const satang = Math.round(thb * 100);
                    setData({
                      ...data,
                      image_price: satang,
                    });
                  }}
                />
              </div>
            )}

            {/* Free Download Notice */}
            {data.image_price === 0 && (
              <div className="md:col-span-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700"> Users will be able to download images for free!</p>
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

            {/* Photographers Selection */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Event Photographers
                  {selectedPhotographers.length > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                      {selectedPhotographers.length} selected
                    </span>
                  )}
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPhotographerSection(!showPhotographerSection)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  {showPhotographerSection ? (
                    <>Hide <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>

              {showPhotographerSection && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  {loadingPhotographers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                  ) : availablePhotographers.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No photographers available</p>
                  ) : (
                    <div className="space-y-2">
                      {availablePhotographers.map((photographer) => {
                        const isSelected = selectedPhotographers.includes(photographer.id);
                        return (
                          <label
                            key={photographer.id}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => togglePhotographer(photographer.id)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-600'
                                  : 'border-gray-300 hover:border-indigo-400'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {photographer.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {photographer.first_name && photographer.last_name
                                  ? `${photographer.first_name} ${photographer.last_name}`
                                  : photographer.email?.split('@')[0] || 'User'}
                              </p>
                              <p className="text-xs text-gray-500">{photographer.email}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
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

      {/* TODO: Google Map Picker Dialog - Uncomment when map functionality is needed
      <Dialog open={showMapPicker} onOpenChange={setShowMapPicker}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select Event Location</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div id="google-map" style={{ height: '400px', width: '100%', borderRadius: '8px' }}></div>

            {data.latitude && data.longitude && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  Selected: {data.location}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Coordinates: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p>💡 Click anywhere on the map to select the exact event location</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMapPicker(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleMapSelect}
              disabled={!markerRef.current}
            >
              Confirm Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      */}
    </Dialog>
  );
};

export default EventCreate;
