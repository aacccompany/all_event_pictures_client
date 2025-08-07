import { Link } from "react-router";
import { Button } from "../ui/button";

const EventEmpty = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-center">ไม่พบผลลัพท์</h1>
      <Link to={"/"}>
        <Button className="w-full bg-blue-700 hover:bg-blue-800">Clear Filter</Button>
      </Link>
    </div>
  );
};

export default EventEmpty;
