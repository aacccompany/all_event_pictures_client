import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getMyNotifications, getUnreadCount, markAsRead } from "@/api/notification";
import useAuthStore from "@/stores/auth-store";

const NotificationDropdown = () => {
    const token = useAuthStore((state) => state.token);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchCount = async () => {
            if (!token) return;
            try {
                const res = await getUnreadCount(token);
                setUnreadCount(res.count);
            } catch (err) {
                console.error(err);
            }
        }
        fetchCount();
        // Poll every 30 seconds
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const handleOpenChange = async (isOpen) => {
        setOpen(isOpen);
        if (isOpen && token) {
            try {
                const res = await getMyNotifications(token);
                setNotifications(res);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleRead = async (n) => {
        if (!n.is_read && token) {
            try {
                await markAsRead(token, n.id);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: true } : item));
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <div className="relative inline-block cursor-pointer mr-4">
                    <Button variant="ghost" size="icon" className="relative text-gray-700 hover:bg-gray-100">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 mr-4" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={`cursor-pointer p-3 flex flex-col items-start gap-1 ${!n.is_read ? 'bg-blue-50' : ''}`}
                                onClick={() => handleRead(n)}
                            >
                                <div className="font-semibold text-sm">{n.title}</div>
                                <div className="text-xs text-gray-500 line-clamp-2">{n.message}</div>
                                <div className="text-[10px] text-gray-400 self-end">
                                    {new Date(n.created_at).toLocaleDateString()}
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
