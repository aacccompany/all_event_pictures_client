import { get_active_events, search_events } from "@/api/event";
import { create } from "zustand";

const eventStore = (set) => ({
  events: [],
  actionsGetEvents: async () => {
    try {
      const res = await get_active_events();
      set({ events: res.data });
    } catch (error) {
      console.log(error)
    }
  },

  actionFilters: async(title = "") => {
    try {
      const res = await search_events(title)
      console.log(res.data)
      set({events: res.data})
    } catch (error) {
      console.log(error)
    }
  }
});

const useEventStore = create(eventStore);

export default useEventStore;
