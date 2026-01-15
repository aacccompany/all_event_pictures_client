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
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="showDeleted"
                        checked={showDeleted}
                        onChange={(e) => setShowDeleted(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                        htmlFor="showDeleted"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Show Deleted
                    </label>
                </div>
                <Button onClick={onCreateClick}>Create User</Button>
            </div>
        </div>
    );
};

export default UserHeader;
