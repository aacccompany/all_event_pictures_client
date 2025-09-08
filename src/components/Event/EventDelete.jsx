import { remove_event } from "@/api/event";
import { Button } from "../ui/button";
import { toast } from "sonner";
import useAuthStore from "@/stores/auth-store";
import useEventStore from "@/stores/event-store";
import { useEffect } from "react";

const EventDelete = ({ id, title }) => {
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents)
  const actionGetMyEvents = useEventStore((state) => state.actionGetMyEvents)
  const token = useAuthStore((state) => state.token);

  const handleRemove = async () => {
    try {
      await remove_event(token, id);
      await actionGetEvents()
      await actionGetMyEvents(token)
      toast.success(`Event "${title}" deleted successfully`);
    } catch (error) {
      console.log(error);
      const msgError = error.response?.data?.detail || "Failed to delete event";
      toast.error(msgError);
    }
  };


  const handleDeleteClick = () => {
    toast.error(`Are you sure you want to delete "${title}"`, {
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
