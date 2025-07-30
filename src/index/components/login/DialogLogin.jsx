import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserRound } from 'lucide-react';
import { Mail } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { DialogClose } from "@radix-ui/react-dialog";


const DialogLogin = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-blue-700 text-white hover:bg-blue-900">
            <UserRound />
            Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle className="flex gap-2 mb-5">
              <UserRound className="text-blue-700" />
              <span class="text-2xl font-semibold leading-none tracking-tight flex items-center">Sign In</span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
            <div className="relative grid gap-3">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email-1" name="email" type="email" placeholder="your@email.com" className="pl-8" />
            </div>
            <label htmlFor="username-1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
            <div className="relative grid gap-3">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" name="password" type="password" placeholder="Enter your password" className="pl-8" />
            </div>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Forgot your password?</a>
            <a href="#" className="text-sm text-blue-500 hover:text-blue-600">Don't have an account?</a>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-900">Sign In</Button>
          </DialogFooter>

        </DialogContent>
      </form>
    </Dialog>

  )
}

export default DialogLogin