import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserHeader = ({ searchTerm, onSearchChange, onCreateClick, showDeleted, setShowDeleted }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">User Management</h1>
            <div className="flex gap-4">
                <Input
                    placeholder="Search email or name..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="w-64"
                />
            </div>
        </div>
    );
};

export default UserHeader;
