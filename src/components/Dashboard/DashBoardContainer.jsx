import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar } from "lucide-react";

const DashBoardContainer = () => {
  // --- MOCKUP DATA STATE ---
  // This is where the mockup data is stored.
  // In a real application, you would initialize these with empty values
  // and fetch the data from an API inside the useEffect hook.
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: { value: 0, change: "" },
    totalEarnings: { value: "THB 0", change: "" },
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  // useEffect hook to fetch data or define mockup data when the component mounts.
  useEffect(() => {
    // --- MOCKUP DATA DEFINITION ---
    // This section defines the mockup data.
    // To connect to your database, you would replace this section
    // with API calls (e.g., using fetch or axios).
    
    const mockupStats = {
      totalEvents: {
        value: 7,
        change: "+2 since last month",
      },
      totalEarnings: {
        value: "THB 150,000",
        change: "+15% from last month",
      },
    };

    const mockupRecentEvents = [
      {
        eventName: "Wedding Ceremony",
        date: "2025-09-15",
        status: "Completed",
      },
      {
        eventName: "Corporate Gala",
        date: "2025-09-20",
        status: "Completed",
      },
      {
        eventName: "Music Festival",
        date: "2025-10-05",
        status: "Upcoming",
      },
      {
        eventName: "Birthday Party",
        date: "2025-10-12",
        status: "Upcoming",
      },
    ];

    const mockupRecentSales = [
      {
        customerName: "John Doe",
        eventName: "Wedding Ceremony",
        amount: "THB 2,500",
      },
      {
        customerName: "Jane Smith",
        eventName: "Wedding Ceremony",
        amount: "THB 1,500",
      },
      {
        customerName: "Michael Johnson",
        eventName: "Corporate Gala",
        amount: "THB 3,000",
      },
      {
        customerName: "Emily Davis",
        eventName: "Wedding Ceremony",
        amount: "THB 800",
      },
    ];
    
    // --- DATA FETCHING EXAMPLE (COMMENTED OUT) ---
    // Here is how you might fetch data from your API:
    //
    // const fetchDashboardData = async () => {
    //   try {
    //     const statsResponse = await fetch('/api/dashboard-stats');
    //     const eventsResponse = await fetch('/api/recent-events');
    //     const salesResponse = await fetch('/api/recent-sales');
    //
    //     const statsData = await statsResponse.json();
    //     const eventsData = await eventsResponse.json();
    //     const salesData = await salesResponse.json();
    //
    //     setDashboardStats(statsData);
    //     setRecentEvents(eventsData);
    //     setRecentSales(salesData);
    //   } catch (error) {
    //     console.error("Failed to fetch dashboard data:", error);
    //   }
    // };
    //
    // fetchDashboardData();

    // Set the state with the mockup data for now
    setDashboardStats(mockupStats);
    setRecentEvents(mockupRecentEvents);
    setRecentSales(mockupRecentSales);

  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Total Events Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalEvents.value}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalEvents.change}
            </p>
          </CardContent>
        </Card>
        {/* Total Earnings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalEarnings.value}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalEarnings.change}
            </p>
            <Button className="mt-4">Withdraw Money</Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Events Table */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              An overview of your most recent and upcoming events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{event.eventName}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <Badge variant={event.status === 'Completed' ? 'default' : 'outline'}>
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Recent Sales List */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              Recent sales from your events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale, index) => (
                <div className="flex items-center" key={index}>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                    <p className="text-sm text-muted-foreground">{sale.eventName}</p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoardContainer;