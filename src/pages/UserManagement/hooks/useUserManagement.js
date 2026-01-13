import { useState, useEffect } from "react";
import { getUsers, deleteUser, createUser, updateUser } from "@/api/super-admin";
import useAuthStore from "@/stores/auth-store";
import Swal from "sweetalert2";

const useUserManagement = () => {
    const token = useAuthStore((state) => state.token);
    const loggedInUser = useAuthStore((state) => state.user);
    
    // Listing & Pagination State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        size: 100, // Fetch more for client-side filtering
        total: 0,
    });

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    
    // Form State
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
        first_name: "",
        last_name: "",
        role: "user",
        enabled: true
    });

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getUsers(token, page, pagination.size);
            setUsers(res.data.items);
            setPagination({
                ...pagination,
                page: res.data.page,
                size: res.data.size,
                total: res.data.total,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            Swal.fire("Error", "Failed to fetch users", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.page);
    }, [pagination.page]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil(pagination.total / pagination.size);
        if (newPage >= 1 && newPage <= totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    // --- Form Logic ---
    const resetForm = () => {
        setFormData({
            email: "",
            password: "",
            confirm_password: "",
            first_name: "",
            last_name: "",
            role: "user",
            enabled: true
        });
        setCurrentUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openCreateModal = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const openUpdateModal = (user) => {
        setCurrentUser(user);
        setFormData({
            email: user.email,
            password: "", 
            confirm_password: "",
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            enabled: user.enabled
        });
        setIsUpdateOpen(true);
    };

    const handleCreateUser = async () => {
        if (formData.password !== formData.confirm_password) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Passwords do not match!',
            });
            return;
        }
        try {
            await createUser(token, formData);
            Swal.fire("Success", "User created successfully", "success");
            setIsCreateOpen(false);
            fetchUsers(pagination.page);
        } catch (error) {
            console.error("Error creating user:", error);
            Swal.fire("Error", error.response?.data?.detail || "Failed to create user", "error");
        }
    };

    const handleUpdateUser = async () => {
        if (formData.password && formData.password !== formData.confirm_password) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Passwords do not match!',
            });
            return;
        }
        try {
            const dataToUpdate = { ...formData };
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
                delete dataToUpdate.confirm_password;
            }

            await updateUser(token, currentUser.id, dataToUpdate);
            Swal.fire("Success", "User updated successfully", "success");
            setIsUpdateOpen(false);
            fetchUsers(pagination.page);
        } catch (error) {
            console.error("Error updating user:", error);
            Swal.fire("Error", error.response?.data?.detail || "Failed to update user", "error");
        }
    };

    const handleDeleteUser = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(token, id);
                Swal.fire(
                    'Deleted!',
                    'User has been deleted.',
                    'success'
                );
                fetchUsers(pagination.page);
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire("Error", "Failed to delete user", "error");
            }
        }
    };

    return {
        // State
        users,
        loading,
        searchTerm,
        pagination,
        isCreateOpen,
        isUpdateOpen,
        formData,
        loggedInUser,
        
        // Actions
        setIsCreateOpen,
        setIsUpdateOpen,
        handleSearchChange,
        handlePageChange,
        handleInputChange,
        openCreateModal,
        openUpdateModal,
        handleCreateUser,
        handleUpdateUser,
        handleDeleteUser
    };
};

export default useUserManagement;
