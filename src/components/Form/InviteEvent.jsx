import { invite_event } from "@/api/event_user";
import useAuthStore from "@/stores/auth-store";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const InviteEvent = ({ id }) => {
  const token = useAuthStore((state) => state.token);
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);

  const addEmail = () => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmail("");
    }
  };

  const handleInvite = async () => {
    try {
      await invite_event(token, id, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Label>Invite</Label>
      <div className="flex gap-2">
        <Input
          id="user_emails"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="button" onClick={addEmail}>
          Add
        </Button>
      </div>

      <ul className="mt-2">
        {emails.map((item, index) => (
          <li key={index} className="text-sm text-gray-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default InviteEvent;
