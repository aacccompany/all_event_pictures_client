import { get_active_events } from "@/api/event";
import { create } from "zustand";

const eventStore = (set) => ({
  events: [],
  actionsGetEvents: async () => {
    try {
      const res = await get_active_events();
      set({ events: res.data });
    } catch (error) {
      const msgError = error.response?.data?.detail || "Event fail"
      console.log(error)
      return {success: false, message: msgError}
    }
  },
});

const useEventStore = create(eventStore);

export default useEventStore;
