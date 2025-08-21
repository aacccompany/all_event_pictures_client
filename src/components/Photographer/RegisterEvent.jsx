import { join_event } from "@/api/event_user";
import { get_events_joined } from "@/api/user";
import useAuthStore from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RegisterEvent = ({ id }) => {
  const token = useAuthStore((state) => state.token);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    handleGetJoinedEvent();
  }, []);

  const handleGetJoinedEvent = async () => {
    try {
      const res = await get_events_joined(token);
      const alreadyJoined = res.data.some(event => event.id === id);
      setJoined(alreadyJoined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinEvent = async () => {
    try {
      await join_event(id, token);
      setJoined(true); 
      toast.success("Event Joined successfully");
    } catch (error) {
      const msgErr = error.response?.data?.detail || "Register fail";
      toast.warning(msgErr);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="p-6 pt-0 sm:pt-6 sm:px-6 flex-shrink-0">
        <button
          onClick={handleJoinEvent}
          disabled={joined} 
          className={`w-full sm:w-auto font-semibold py-2 px-4 rounded-md transition-colors duration-300
            ${joined ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-700 text-white hover:bg-blue-900"}`}
        >
          {joined ? "Already Joined" : "Register"}
        </button>
      </div>
    </div>
  );
};
export default RegisterEvent;
