import React from "react";
import useUserManagement from "./hooks/useUserManagement";
import UserHeader from "./components/UserHeader";
import UserTable from "./components/UserTable";
import UserFormDialog from "./components/UserFormDialog";

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
        setShowDeleted
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
                onEditClick={openUpdateModal}
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

