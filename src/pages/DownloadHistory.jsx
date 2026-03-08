import React, { useEffect, useState, useMemo } from 'react';
import { get_download_history, re_download_cart } from "@/api/cart";
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, Eye, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const PAGE_SIZE = 10;

const DownloadHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCart, setSelectedCart] = useState(null);
  const token = useAuthStore((state) => state.token);

  const fetchDownloadHistory = async () => {
    setLoading(true);
    try {
      const res = await get_download_history(token);
      const sortedData = res.data.sort((a, b) => new Date(b.purchase_date) - new Date(a.purchase_date));
      setHistory(sortedData);
    } catch (error) {
      console.error("Error fetching download history:", error);
      toast.error("Failed to fetch download history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDownloadHistory();
  }, [token]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return history.filter(item =>
      !q || item.event_name?.toLowerCase().includes(q)
    );
  }, [history, search]);

  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleReDownload = async (cartId) => {
    try {
      toast.info(`Initiating re-download for cart ID: ${cartId}`);
      const res = await re_download_cart(token, cartId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cart_${cartId}_Photos.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Images re-downloaded successfully!");
    } catch (error) {
      console.error("Error during re-download:", error);
      toast.error("Failed to initiate re-download.");
    }
  };

  const calculateCountdown = (expirationDate) => {
    const now = new Date();
    const exp = new Date(expirationDate);
    const diff = exp - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Download History</h1>
        <p className="text-muted-foreground text-sm">
          Manage your purchased photos and monitor expiration. Data is kept for 60 days.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Purchased Events</CardTitle>
            <CardDescription>All your photo purchases in one place</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-12 text-muted-foreground">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">No download history found.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Photos</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-gray-50/50">
                      <TableCell className="font-medium">{item.event_name || 'N/A'}</TableCell>
                      <TableCell>{item.number_of_files} photos</TableCell>
                      <TableCell>
                        {new Date(item.purchase_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">
                            {calculateCountdown(item.expiration_date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCart(item)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReDownload(item.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between pt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Button>
                  <span className="text-sm font-medium">Page {page} / {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedCart} onOpenChange={(open) => !open && setSelectedCart(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Details: {selectedCart?.event_name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
            {selectedCart?.images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-100 group">
                <img
                  src={img.secure_url}
                  alt={img.public_id}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setSelectedCart(null)}>Close</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                handleReDownload(selectedCart.id);
                setSelectedCart(null);
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Download All ZIP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DownloadHistory;
