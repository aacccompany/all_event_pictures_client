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
import Swal from "sweetalert2";
import useAuthStore from "@/stores/auth-store";

const WithdrawalManagement = () => {
    const token = useAuthStore((state) => state.token);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: "Approve Withdrawal?",
            text: "This will deduct the amount from the user's wallet.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it!",
        });

        if (result.isConfirmed) {
            try {
                await approveWithdrawal(token, id);
                Swal.fire("Approved!", "The withdrawal has been approved.", "success");
                fetchData();
            } catch (error) {
                Swal.fire("Error", "Failed to approve request", "error");
            }
        }
    };

    const handleReject = async (id) => {
        const result = await Swal.fire({
            title: "Reject Withdrawal?",
            text: "This will mark the request as rejected.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, reject it!",
        });

        if (result.isConfirmed) {
            try {
                await rejectWithdrawal(token, id);
                Swal.fire("Rejected!", "The withdrawal has been rejected.", "success");
                fetchData();
            } catch (error) {
                Swal.fire("Error", "Failed to reject request", "error");
            }
        }
    };

    return (
        <div className="container mx-auto p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Withdrawal Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
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
                                    <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No withdrawal requests found.</TableCell>
                                </TableRow>
                            ) : (
                                requests.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.user_id}</TableCell>
                                        <TableCell>{(req.amount / 100).toFixed(2)}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={req.bank_snapshot}>{req.bank_snapshot}</TableCell>
                                        <TableCell>
                                            <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                {req.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {req.status === "pending" && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700 h-8 px-2"
                                                        onClick={() => handleApprove(req.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        className="h-8 px-2"
                                                        onClick={() => handleReject(req.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default WithdrawalManagement;
