import { Label } from "../ui/label";
import { Input } from "../ui/input";

const UploadImageCover = ({ setImageFile }) => {
  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
  };

  return (
    <div>
      <Label className="capitalize mb-2">upload image</Label>
      <div className="flex items-center gap-2">
        <Input
          onChange={handleOnChange}
          type="file"
          id="image_cover"
          name="image_cover"
        />
      </div>
    </div>
  );
};

export default UploadImageCover;
