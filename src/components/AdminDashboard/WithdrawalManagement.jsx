import { useState, useEffect } from "react";
import { getWithdrawalRequests, approveWithdrawal, rejectWithdrawal } from "@/api/super-admin";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye } from "lucide-react";
import Swal from "sweetalert2"; // Keep for non-modal alerts if needed, or remove. Keeping for error toasts.
import useAuthStore from "@/stores/auth-store";

const WithdrawalManagement = () => {
    const token = useAuthStore((state) => state.token);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Alert Dialog State
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertAction, setAlertAction] = useState(null); // 'approve' or 'reject'
    const [alertTargetId, setAlertTargetId] = useState(null);

    const fetchData = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await getWithdrawalRequests(token);
            setRequests(response.data);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to fetch withdrawal requests", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    // Construct the confirmation action
    const confirmAction = (action, id) => {
        setAlertAction(action);
        setAlertTargetId(id);
        setAlertOpen(true);
    };

    const handleConfirm = async () => {
        if (!alertAction || !alertTargetId) return;

        try {
            if (alertAction === 'approve') {
                await approveWithdrawal(token, alertTargetId);
                Swal.fire("Approved!", "The withdrawal has been approved.", "success");
            } else if (alertAction === 'reject') {
                await rejectWithdrawal(token, alertTargetId);
                Swal.fire("Rejected!", "The withdrawal has been rejected.", "success");
            }
            // Close details dialog if open and matches
            if (selectedRequest && selectedRequest.id === alertTargetId) {
                setSelectedRequest(null);
            }
            fetchData();
        } catch (error) {
            Swal.fire("Error", `Failed to ${alertAction} request`, "error");
        } finally {
            setAlertOpen(false);
            setAlertAction(null);
            setAlertTargetId(null);
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Withdrawal Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Amount (THB)</TableHead>
                                <TableHead>Bank Info</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">No withdrawal requests found.</TableCell>
                                </TableRow>
                            ) : (
                                requests.map((req) => (
                                    <TableRow
                                        key={req.id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{req.user?.first_name} {req.user?.last_name}</span>
                                                <span className="text-xs text-muted-foreground">{req.user?.email || `ID: ${req.user_id}`}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{(req.amount / 100).toFixed(2)}</TableCell>
                                        <TableCell className="max-w-[200px]">
                                            <div className="truncate" title={req.bank_snapshot}>
                                                {req.bank_snapshot}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                {req.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setSelectedRequest(req)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {req.status === "pending" && (
                                                    <>
                                                        <Button
                                                            className="bg-green-600 hover:bg-green-700 h-8 px-2 text-xs"
                                                            onClick={() => confirmAction('approve', req.id)}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            className="h-8 px-2 text-xs"
                                                            onClick={() => confirmAction('reject', req.id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Detail View Dialog */}
            <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Withdrawal Request Details</DialogTitle>
                        <DialogDescription>
                            Review the full details of this withdrawal request.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">User:</span>
                                <div className="col-span-3">
                                    <p>{selectedRequest.user?.first_name} {selectedRequest.user?.last_name}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.user?.email}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.user?.tel}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Amount:</span>
                                <div className="col-span-3 font-bold text-lg">
                                    THB {(selectedRequest.amount / 100).toFixed(2)}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <span className="font-semibold text-right mt-1">Bank Info:</span>
                                <div className="col-span-3 p-3 bg-muted rounded-md text-sm">
                                    {selectedRequest.bank_snapshot}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Status:</span>
                                <div className="col-span-3">
                                    <Badge variant={selectedRequest.status === 'approved' ? 'default' : selectedRequest.status === 'rejected' ? 'destructive' : 'secondary'}>
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="font-semibold text-right">Date:</span>
                                <div className="col-span-3 text-sm text-muted-foreground">
                                    {new Date(selectedRequest.created_at).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedRequest?.status === "pending" ? (
                            <div className="flex w-full justify-between sm:justify-end gap-2">
                                <Button
                                    variant="destructive"
                                    onClick={() => confirmAction('reject', selectedRequest.id)}
                                >
                                    Reject Request
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => confirmAction('approve', selectedRequest.id)}
                                >
                                    Approve Request
                                </Button>
                            </div>
                        ) : (
                            <Button variant="secondary" onClick={() => setSelectedRequest(null)}>Close</Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Alert Dialog */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertAction === 'approve'
                                ? "This will deduct the amount from the user's wallet. This action cannot be undone."
                                : "This will mark the request as rejected. The user will be notified."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={alertAction === 'reject' ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            Confirm {alertAction === 'approve' ? 'Approval' : 'Rejection'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default WithdrawalManagement;
