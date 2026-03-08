import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { getUsers, updateUser, deleteUser } from "@/api/super-admin";
import { adminDeductBalance } from "@/api/wallet";
import useAuthStore from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Edit, Trash2, ChevronLeft, ChevronRight, Calculator } from "lucide-react";
import Swal from "sweetalert2";

const PAGE_SIZE = 10;

const PhotographerManagement = () => {
    const token = useAuthStore((state) => state.token);
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Edit modal state
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "", enabled: true, password: "", confirm_password: "" });

    const fetchPhotographers = async () => {
        setLoading(true);
        try {
            const res = await getUsers(token, 1, 1000, false, "user");
            setPhotographers(res.data.items);
        } catch (err) {
            console.error("Failed to fetch photographers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchPhotographers();
    }, [token]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return photographers.filter(
            (p) =>
                !q ||
                p.email?.toLowerCase().includes(q) ||
                p.first_name?.toLowerCase().includes(q) ||
                p.last_name?.toLowerCase().includes(q)
        );
    }, [photographers, search]);

    useEffect(() => { setPage(1); }, [search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openEdit = (user) => {
        setEditTarget(user);
        setEditForm({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            enabled: user.enabled,
            password: "",
            confirm_password: "",
        });
    };

    const handleSave = async () => {
        if (editForm.password && editForm.password !== editForm.confirm_password) {
            Swal.fire("Error", "Passwords do not match", "error");
            return;
        }
        const payload = { ...editForm };
        if (!payload.password) { delete payload.password; delete payload.confirm_password; }
        try {
            await updateUser(token, editTarget.id, payload);
            Swal.fire("Success", "Photographer updated", "success");
            setEditTarget(null);
            fetchPhotographers();
        } catch (err) {
            Swal.fire("Error", err.response?.data?.detail || "Failed to update", "error");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the photographer account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete",
            confirmButtonColor: "#d33",
        });
        if (result.isConfirmed) {
            try {
                await deleteUser(token, id);
                Swal.fire("Deleted!", "Photographer deleted.", "success");
                fetchPhotographers();
            } catch (err) {
                Swal.fire("Error", "Failed to delete", "error");
            }
        }
    };

    const handleDeductBalance = async (user) => {
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
                const amountSatang = Math.round(parseFloat(amount) * 100);
                await adminDeductBalance(token, user.id, amountSatang);
                Swal.fire('Deducted!', 'Revenue has been deducted.', 'success');
                fetchPhotographers();
            } catch (error) {
                console.error("Deduction error:", error);
                Swal.fire('Error', 'Failed to deduct revenue', 'error');
            }
        }
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Back */}
            <Link
                to="/super-admin/dashboard"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">Photographer Management</h2>
                <p className="text-muted-foreground text-sm">
                    View, edit, manage revenue, and delete photographer accounts.
                </p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-1">
                        <CardDescription>Total Photographers</CardDescription>
                        <CardTitle className="text-2xl">{photographers.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardDescription>Active</CardDescription>
                        <CardTitle className="text-2xl text-green-600">
                            {photographers.filter((p) => p.enabled).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardDescription>Total Wallet Balance</CardDescription>
                        <CardTitle className="text-2xl text-blue-600">
                            {(photographers.reduce((acc, p) => acc + (p.wallet_balance || 0), 0) / 100).toFixed(2)} THB
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle>All Photographers</CardTitle>
                        <CardDescription>Manage photographers and their revenue</CardDescription>
                    </div>
                    <div className="relative w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No photographers found.</p>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No.</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginated.map((user, idx) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                                            <TableCell className="text-sm">{user.email}</TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {user.first_name} {user.last_name}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {(user.wallet_balance / 100).toFixed(2)} THB
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.enabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                    {user.enabled ? "Active" : "Disabled"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                                                    onClick={() => handleDeductBalance(user)}
                                                >
                                                    <Calculator className="h-4 w-4 mr-1" />
                                                    Cut Revenue
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                                <span>
                                    Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} photographers
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </Button>
                                    <span className="font-medium text-foreground">Page {page} / {totalPages}</span>
                                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                                        Next <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={(open) => { if (!open) setEditTarget(null); }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Photographer</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Email</Label>
                            <Input className="col-span-3" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">First Name</Label>
                            <Input className="col-span-3" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Last Name</Label>
                            <Input className="col-span-3" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Password</Label>
                            <Input className="col-span-3" type="password" placeholder="Leave blank to keep current" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Confirm</Label>
                            <Input className="col-span-3" type="password" value={editForm.confirm_password} onChange={(e) => setEditForm({ ...editForm, confirm_password: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Enabled</Label>
                            <input type="checkbox" checked={editForm.enabled} onChange={(e) => setEditForm({ ...editForm, enabled: e.target.checked })} className="h-4 w-4" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PhotographerManagement;
