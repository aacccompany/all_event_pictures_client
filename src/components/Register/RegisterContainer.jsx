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

  const handleRedirect = () => {
    navigate("/");
  };

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.password || !form.confirmPassword || !form.email)
        return toast.warning("Register Fail!");
      if (form.password != form.confirmPassword)
        return toast.warning("Password invalid");
      await authRegister(form);
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
      <RegisCard handleOnChange={handleOnChange} handleSubmit={handleSubmit} />
    </div>
  );
};

export default RegisterContainer;
