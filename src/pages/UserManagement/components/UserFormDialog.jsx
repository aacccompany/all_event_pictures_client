import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UserFormDialog = ({
    isOpen,
    onOpenChange,
    title,
    formData,
    onInputChange,
    onSubmit,
    isUpdate = false
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" name="email" value={formData.email} onChange={onInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder={isUpdate ? "Leave blank to keep current" : ""}
                            value={formData.password}
                            onChange={onInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="confirm_password" className="text-right">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            placeholder={isUpdate ? "Retype password" : ""}
                            value={formData.confirm_password}
                            onChange={onInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="first_name" className="text-right">First Name</Label>
                        <Input id="first_name" name="first_name" value={formData.first_name} onChange={onInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="last_name" className="text-right">Last Name</Label>
                        <Input id="last_name" name="last_name" value={formData.last_name} onChange={onInputChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={onInputChange}
                            className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="user">Photographer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="enabled" className="text-right">Enabled</Label>
                        <div className="col-span-3 flex items-center">
                            <input
                                type="checkbox"
                                id="enabled"
                                name="enabled"
                                checked={formData.enabled}
                                onChange={onInputChange}
                                className="h-4 w-4"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onSubmit}>
                        {isUpdate ? "Save Changes" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserFormDialog;
