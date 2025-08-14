import { remove_event } from "@/api/event";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useParams } from "react-router";

const EventDelete = () => {
  const { id } = useParams();

  const handleRemove = async () => {
    try {
      const res = await remove_event(id);
      console.log(res.data);
      toast.success("Event deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete event");
    }
  };

  const handleDeleteClick = () => {
    toast.error("Are you sure you want to delete this event?", {
      duration: Infinity,
      action: (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              handleRemove();
              toast.dismiss();
            }}
          >
            OK
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              console.log("Cancel clicked");
              toast.dismiss();
            }}
          >
            Cancel
          </Button>
        </div>
      ),
    });
  };

  return (
    <Button
      onClick={handleDeleteClick}
      className="ml-4 bg-red-600 text-white hover:bg-red-900 transition-colors duration-150 cursor-pointer"
    >
      Delete
    </Button>
  );
};

export default EventDelete;
