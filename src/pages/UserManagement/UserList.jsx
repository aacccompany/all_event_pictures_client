import React from "react";
import useUserManagement from "./hooks/useUserManagement";
import UserHeader from "./components/UserHeader";
import UserTable from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";
import Swal from "sweetalert2";
import { adminDeductBalance } from "@/api/wallet";
import useAuthStore from "@/stores/auth-store";

const UserList = () => {
    const {
        users,
        loading,
        searchTerm,
        pagination,
        isCreateOpen,
        isUpdateOpen,
        formData,
        loggedInUser,
        setIsCreateOpen,
        setIsUpdateOpen,
        handleSearchChange,
        handlePageChange,
        handleInputChange,
        openCreateModal,
        openUpdateModal,
        handleCreateUser,
        handleUpdateUser,
        handleDeleteUser,
        showDeleted,
        setShowDeleted,
        fetchUsers
    } = useUserManagement();

    return (
        <div className="container mx-auto py-8">
            <UserHeader
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                onCreateClick={openCreateModal}
                showDeleted={showDeleted}
                setShowDeleted={setShowDeleted}
            />

            <UserTable
                users={users}
                loading={loading}
                searchTerm={searchTerm}
                pagination={pagination}
                loggedInUser={loggedInUser}
                onEditClick={async (user, action) => {
                    if (action === 'deduct') {
                        const { value: amount } = await Swal.fire({
                            title: 'Cut Revenue',
                            input: 'number',
                            inputLabel: `Current Balance: ${(user.wallet_balance / 100).toFixed(2)} THB`,
                            inputPlaceholder: 'Enter amount to deduct (THB)',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                if (!value) {
                                    return 'You need to write something!'
                                }
                                if (parseFloat(value) <= 0) {
                                    return 'Amount must be greater than 0'
                                }
                                if (parseFloat(value) * 100 > user.wallet_balance) {
                                    return 'Insufficient funds'
                                }
                            }
                        });

                        if (amount) {
                            try {
                                // Convert THB to Satang
                                const amountSatang = Math.round(parseFloat(amount) * 100);
                                const token = useAuthStore.getState().token;
                                await adminDeductBalance(token, user.id, amountSatang);
                                Swal.fire('Deducted!', 'Revenue has been deducted.', 'success');
                                // Refresh user list
                                fetchUsers(pagination.page);
                            } catch (error) {
                                console.error("Deduction error:", error);
                                Swal.fire('Error', 'Failed to deduct revenue', 'error');
                            }
                        }
                    } else {
                        openUpdateModal(user);
                    }
                }}
                onDeleteClick={handleDeleteUser}
                onPageChange={handlePageChange}
            />

            <UserFormDialog
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create New User"
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleCreateUser}
                isUpdate={false}
            />

            <UserFormDialog
                isOpen={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
                title="Update User"
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleUpdateUser}
                isUpdate={true}
            />
        </div>
    );
};

export default UserList;

