import { Link } from "react-router";
import { Button } from "../ui/button";

const EventEmpty = () => {
  return (
    <div className="mt-auto flex flex-col gap-6 items-center mb-10 px-4">
  {/* ปรับ Margin และ Gap ให้ดูโปร่งขึ้น */}
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">ไม่พบผลลัพธ์</h1>
  
  <Link to="/" className="w-full md:w-auto">
    <Button 
      className="w-full md:w-64 bg-blue-700 hover:bg-blue-800 text-white py-6 rounded-xl text-lg font-medium transition-all active:scale-95 shadow-lg shadow-blue-200"
    >
      Clear Filter
    </Button>
  </Link>
</div>
  );
};

export default EventEmpty;
