import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { getMyHistory } from "@/api/wallet";

const TransactionHistory = ({ token }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && token) {
            fetchHistory();
        }
    }, [isOpen, token]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await getMyHistory(token);
            // Ensure sorting by newest first (descending), use ID as tie-breaker
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                if (dateB.getTime() === dateA.getTime()) {
                    return b.id - a.id;
                }
                return dateB - dateA;
            });
            setTransactions(sortedData);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    History
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl w-[900px]">
                <SheetHeader>
                    <SheetTitle>Transaction History</SheetTitle>
                    <SheetDescription>
                        A complete list of your earnings and withdrawals.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto mt-6 h-[calc(100vh-150px)] pr-2">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading...</div>
                    ) : transactions && transactions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-[100px]">Type</TableHead>
                                    <TableHead className="text-right w-[120px]">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="font-medium whitespace-nowrap align-top">
                                            {formatDate(t.created_at)}
                                        </TableCell>
                                        <TableCell className="break-all align-top text-sm text-gray-600">
                                            {t.description}
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Badge
                                                variant={t.type === 'earning' ? 'default' : 'secondary'}
                                                className={t.type === 'earning' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600 text-white'}
                                            >
                                                {t.type === 'earning' ? 'Earn' : 'Withdraw'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className={`text-right font-bold whitespace-nowrap align-top ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.amount >= 0 ? '+' : ''}THB {(t.amount / 100).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No transactions found.
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default TransactionHistory;
