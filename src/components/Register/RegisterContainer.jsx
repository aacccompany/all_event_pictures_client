import { useState } from "react";
import RegisCard from "./RegisCard";
import { authRegister } from "@/api/auth";
import { toast } from "sonner";

const RegisterContainer = () => {
    const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
    // console.log(e.target.name, e.target.value)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        if (!form.password || !form.confirmPassword || !form.email) return alert("สันขวาน")
        if (form.password != form.confirmPassword) return alert("รหัสผ่านไม่ตรง")
        await authRegister(form)
        toast.success('Registration successfuly')
    } catch (error) { 
        const msgError = error.response?.data?.detail || "Register Faill" 
        toast.warning(msgError)
        console.log(error)
    }
  }


  return (
    <div>
      <RegisCard handleOnChange={handleOnChange} handleSubmit={handleSubmit}/>
    </div>
  );
};

export default RegisterContainer;
