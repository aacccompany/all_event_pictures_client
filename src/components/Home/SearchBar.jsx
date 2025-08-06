import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";
import useEventStore from "@/stores/event-store";

const SearchBar = () => {
  const [titleParam, setTitleParam] = useSearchParams();
  const actionFilters = useEventStore((state) => state.actionFilters)

  const updateSearch = useDebouncedCallback((value) => {
    const params = new URLSearchParams(titleParam);
    if (value) {
      params.set("title", value);
    } else {
      params.delete("title");
    }
    setTitleParam(params);
  }, 500);

  const handleSearch = (e) => {
    updateSearch(e.target.value);
  };

  const title = titleParam.get("title");

  useEffect(() => {
    if (title) actionFilters(title);
  }, [title]);

  return (
    <div className="flex justify-center items-center p-8 sm:p-16 md:p-24 bg-blue-700">
      <div className="w-full max-w-xl items-center flex flex-col gap-5 ">
        <label
          htmlFor="eventSearch"
          className="font-bold text-4xl sm:text-5xl lg:text-6xl text-center w-full text-white"
        >
          Find Your Perfect Event Photo
        </label>
        <label
          htmlFor="eventSearch"
          className="font-normal text-lg sm:text-xl text-center w-full text-gray-300"
        >
          Discover and purchase professional photos from your favorite events.
          Upload your face photo to find yourself instantly!
        </label>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <Input
            id="eventSearch"
            className="w-full pl-10 bg-white"
            onChange={handleSearch}
            placeholder="Search by event name...."
            type="text"
            aria-label="title"
            defaultValue={title}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
