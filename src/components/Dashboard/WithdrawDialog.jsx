import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { requestWithdraw } from "@/api/wallet";
import Swal from "sweetalert2";

const WithdrawDialog = ({ token, currentBalance, onWithdrawSuccess }) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const withdrawAmount = parseFloat(amount) * 100; // Convert to Satang

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            Swal.fire("Error", "Please enter a valid amount", "error");
            return;
        }

        if (withdrawAmount > currentBalance) {
            Swal.fire("Error", "Insufficient balance", "error");
            return;
        }

        setLoading(true);
        try {
            await requestWithdraw(token, withdrawAmount);
            Swal.fire("Success", "Withdrawal request submitted", "success");
            setOpen(false);
            setAmount("");
            if (onWithdrawSuccess) onWithdrawSuccess();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.response?.data?.detail || "Failed to request withdrawal", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold">
                    Withdraw
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Withdrawal</DialogTitle>
                    <DialogDescription>
                        Enter the amount you wish to withdraw. Current Balance: {(currentBalance / 100).toFixed(2)} THB
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleWithdraw}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="0.00"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Confirm Withdrawal"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawDialog;
