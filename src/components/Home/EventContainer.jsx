import useEventStore from "@/stores/event-store";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import HowItWorks from "./HowitWork";
import SearchBar from "./SearchBar";
import EventLists from "./EventLists";
import { Dialog } from "@radix-ui/react-dialog";
import DialogUpdate from "../Event/DialogUpdate";


const EventContainer = () => {
  const actionFilters = useEventStore((state) => state.actionFilters);
  const actionsGetActiveEvents = useEventStore((state) => state.actionsGetActiveEvents);
  const [titleParam, _] = useSearchParams();

  const title = titleParam.get("title");

  useEffect(() => {
     if ((title)) {
      actionFilters(title)
     } else if (!title) {
      actionsGetActiveEvents()
     }
    }, [title]);  

   
  return (
    <div>
      <SearchBar/>
      {!title && <HowItWorks />}
      <EventLists/>
    </div>
  )
};

export default EventContainer;
