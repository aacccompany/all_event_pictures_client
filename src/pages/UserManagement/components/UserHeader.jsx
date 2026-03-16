import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserHeader = ({ searchTerm, onSearchChange, roleFilter, onRoleFilterChange, onCreateClick, showDeleted, setShowDeleted }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <div className="flex gap-4 items-center">
                <select
                    value={roleFilter}
                    onChange={onRoleFilterChange}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <option value="all">All Roles</option>
                    <option value="user">Photographer</option>
                    <option value="admin">Organizer</option>
                </select>
                <Input
                    placeholder="Search email or name..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="w-64"
                />
                <Button onClick={onCreateClick}>
                    Create New User
                </Button>
            </div>
        </div>
    );
};

export default UserHeader;
