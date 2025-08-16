import { get_active_events, get_events, search_events } from "@/api/event";
import { get_my_events } from "@/api/user";
import { create } from "zustand";

const eventStore = (set) => ({
  activeEvents: [],
  events: [],
  myEvents: [],
  actionsGetActiveEvents: async () => {
    try {
      const res = await get_active_events();
      set({ activeEvents: res.data });
    } catch (error) {
      console.log(error)
    }
  },

  actionsGetEvents: async () => {
    try {
      const res = await get_events();
      set({ events: res.data });
    } catch (error) {
      console.log(error)
    }
  },

  actionFilters: async(title = "") => {
    try {
      const res = await search_events(title)
      set({activeEvents: res.data})
    } catch (error) {
      console.log(error)
    }
  },
  
  actionGetMyEvents: async(token) => {
    try {
      const res = await get_my_events(token)
      set({myEvents: res.data})
    } catch (error) {
      console.log(error)
    }
  }
});

const useEventStore = create(eventStore);

export default useEventStore;
