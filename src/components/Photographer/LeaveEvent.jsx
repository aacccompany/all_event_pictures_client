import { leave_event } from "@/api/event_user";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";
import useEventStore from "@/stores/event-store";

const LeaveEvent = ({ id }) => {
  const token = useAuthStore((state) => state.token);
  const actionGetJoinedEvent = useEventStore(
    (state) => state.actionGetJoinedEvent
  );

  const handleLeaveEvent = async () => {
    try {
      const res = await leave_event(token, id);
      toast.success("Cancel Successfully");
      await actionGetJoinedEvent(token)
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="p-6 w-full sm:w-auto">
        <Button
          onClick={handleLeaveEvent}
          className="w-full bg-red-600 text-white p-10 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Cancel Registration
        </Button>
      </div>
    </div>
  );
};
export default LeaveEvent;
