import { useState } from "react";
import RegisCard from "./RegisCard";
import { authRegister } from "@/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const RegisterContainer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState(false);

  const handleRedirect = () => {
    navigate("/");
  };

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.password || !form.confirmPassword || !form.email)
        return toast.warning("Register Fail!");
      if (form.password != form.confirmPassword)
        return toast.warning("Password invalid");
      if (!file) {
        setImageError(true);
        return toast.warning("Book Bank Image is required!");
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("book_bank_image", file);

      await authRegister(formData);
      toast.success("Registration successfuly");
      handleRedirect()
    } catch (error) {
      const msgError = error.response?.data?.detail || "Register Fail!";
      toast.warning(msgError);
      console.log(error);
    }
  };

  return (
    <div>
      <RegisCard
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        previewImage={previewImage}
        imageError={imageError}
      />
    </div>
  );
};

export default RegisterContainer;
