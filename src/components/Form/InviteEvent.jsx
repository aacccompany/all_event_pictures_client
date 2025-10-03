import { invite_event } from "@/api/event_user";
import useAuthStore from "@/stores/auth-store";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const InviteEvent = ({ id, onInvite, currentInvites }) => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState(currentInvites || []);

  useEffect(() => {
    if (currentInvites) {
      setEmails(currentInvites);
    }
  }, [currentInvites]);

  const addEmail = () => {
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
      setEmail("");
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  useEffect(() => {
    onInvite(emails);
  }, [emails, onInvite]);

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
        <Button type="button" onClick={addEmail} className="bg-blue-700 hover:bg-blue-800">
          Add
        </Button>
      </div>

      <ul className="mt-2">
        {emails.map((item, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-center justify-between">
            {item}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEmail(item)}
              className="text-red-500 hover:text-red-700"
            >
              X
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default InviteEvent;
