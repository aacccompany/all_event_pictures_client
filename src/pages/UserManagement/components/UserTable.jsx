import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";

const UserTable = ({
    users,
    loading,
    searchTerm,
    pagination,
    loggedInUser,
    onEditClick,
    onDeleteClick,
    onPageChange
}) => {
    const totalPages = Math.ceil(pagination.total / pagination.size);

    return (
        <>
            <div className="bg-white rounded-md shadow overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users
                                .filter((user) => {
                                    // 1. Role-Based Visibility
                                    if (loggedInUser?.role === 'super-admin') {
                                        if (user.role !== 'admin') return false;
                                    } else if (loggedInUser?.role === 'admin') {
                                        if (user.role !== 'user') return false;
                                    }

                                    // 2. Search Filter
                                    if (searchTerm) {
                                        const lowerTerm = searchTerm.toLowerCase();
                                        return (
                                            user.email?.toLowerCase().includes(lowerTerm) ||
                                            user.first_name?.toLowerCase().includes(lowerTerm) ||
                                            user.last_name?.toLowerCase().includes(lowerTerm)
                                        );
                                    }
                                    return true;
                                })
                                .map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{(pagination.page - 1) * pagination.size + index + 1}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.first_name} {user.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                        user.role === 'user' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.enabled ? 'Active' : 'Disabled'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => onEditClick(user)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => onDeleteClick(user.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-gray-600">
                    Page {pagination.page} (Showing filtered results from {pagination.size})
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= totalPages}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
};

export default UserTable;
