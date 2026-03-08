import { join_event } from "@/api/event_user";
import { get_events_joined } from "@/api/user";
import useAuthStore from "@/stores/auth-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const RegisterEvent = ({ id, event_type }) => {
  const token = useAuthStore((state) => state.token);
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetJoinedEvent();
  }, []);

  const handleGetJoinedEvent = async () => {
    try {
      const res = await get_events_joined(token);
      const alreadyJoined = res.data.some((event) => event.id === id);
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

  const user = useAuthStore((state) => state.user);

  if (user?.role === "super-admin") {
    return (
      <div className="p-6 pt-0 sm:pt-6 sm:px-6 flex-shrink-0">
        <button
          onClick={() => navigate(`/${user.role}/upload-images/${id}`)}
          className="w-full sm:w-auto font-semibold py-2 px-4 rounded-md transition-colors duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
        >
          Upload / Manage Photos
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 pt-0 sm:pt-6 sm:px-6 flex-shrink-0">
        {event_type === "Public" ? (
          joined ? (
            <button
              disabled
              className="w-full sm:w-auto font-semibold py-2 px-4 rounded-md bg-green-100 text-green-800 cursor-not-allowed border border-green-200"
            >
              Registered
            </button>
          ) : (
            <button
              onClick={handleJoinEvent}
              className="w-full sm:w-auto font-semibold py-2 px-4 rounded-md transition-colors duration-300 bg-blue-700 text-white hover:bg-blue-900"
            >
              Register
            </button>
          )
        ) : (
          <button
            disabled
            className="w-full sm:w-auto bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-md cursor-not-allowed"
          >
            Private
          </button>
        )}
      </div>
    </div>
  );
};
export default RegisterEvent;
