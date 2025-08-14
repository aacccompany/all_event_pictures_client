import { Button } from "../ui/button";
import { toast } from "sonner";

const EventDelete = () => {
  const handleDeleteClick = () => {
    toast.error("Are you sure you want to delete this event?", {
      duration: Infinity, 
      action: (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              toast.dismiss();
            }}
          >
            OK
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              console.log("Cancel clicked");
              toast.dismiss();
            }}
          >
            Cancel
          </Button>
        </div>
      ),
    });
  };
  return (
    <div onClick={handleDeleteClick}>
      <Button className="ml-4 bg-red-600 text-white hover:bg-red-900 transition-colors duration-150 cursor-pointer">
        Delete
      </Button>
    </div>
  );
};
export default EventDelete;
