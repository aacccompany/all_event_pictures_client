import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = () => {
  const [titleParam, setTitleParam] = useSearchParams();

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

  return (
    // คงสี bg-blue-700 เดิมไว้ แต่ใช้ Padding ที่พอดีๆ ไม่กว้างจนเกินไป
    <div className="bg-blue-700 py-16 px-6 sm:py-20 md:py-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        
        {/* หัวข้อ - ปรับฟอนต์ให้ดูโมเดิร์นขึ้นด้วย font-black และ tracking-tight */}
        <div className="text-center space-y-4">
          <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
            Find Your Perfect Event Photo
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl font-medium max-w-2xl mx-auto opacity-80">
            Discover and purchase professional photos from your favorite events instantly.
          </p>
        </div>

        {/* ช่องค้นหา - ทำให้ดูเรียบง่ายแต่พรีเมียมด้วยความโค้งมนที่มากขึ้น */}
        <div className="relative w-full max-w-xl group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
            <Search className="h-6 w-6" />
          </div>
          <Input
            id="eventSearch"
            className="w-full h-14 pl-12 pr-6 bg-white border-none rounded-2xl text-lg shadow-xl shadow-blue-900/20 focus-visible:ring-4 focus-visible:ring-white/20 transition-all placeholder:text-gray-400"
            onChange={handleSearch}
            placeholder="Search by event name..."
            type="text"
            aria-label="title"
          />
        </div>

        {/* Tips เล็กๆ ด้านล่างเพื่อให้ดูเป็นกันเอง */}
        <div className="text-blue-200/70 text-sm font-medium">
          Quick Search: <span className="text-white underline cursor-pointer ml-1">Marathon</span>, <span className="text-white underline cursor-pointer ml-1">Concert</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;