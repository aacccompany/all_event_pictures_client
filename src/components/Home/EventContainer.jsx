import useEventStore from "@/stores/event-store";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import HowItWorks from "./HowitWork";
import SearchBar from "./SearchBar";
import EventLists from "./EventLists";


const EventContainer = () => {
  const actionFilters = useEventStore((state) => state.actionFilters);
  const actionGetEvents = useEventStore((state) => state.actionsGetEvents);
  const [titleParam, _] = useSearchParams();

  const title = titleParam.get("title");

  useEffect(() => {
     if ((title)) {
      actionFilters(title)
     } else if (!title) {
      actionGetEvents()
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
