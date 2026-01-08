import { useState, useEffect } from "react";
import { getDashboardEventStats, getRecentActivities, getRecentSales } from "@/api/dashboard";
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
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: { value: 0, change: "" },
    totalEarnings: { value: "THB 0", change: "" },
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getDashboardEventStats();
        setDashboardStats({
          totalEvents: {
            value: stats.totalEvents,
            change: `${stats.changeSinceLastMonth >= 0 ? "+" : ""}${stats.changeSinceLastMonth} (${stats.percentageChange.toFixed(2)}%) since last month`,
          },
          totalEarnings: {
            value: "THB 150,000",
            change: "+15% from last month",
          },
        });

        const activities = await getRecentActivities();
        setRecentEvents(
          activities.map((a) => ({
            eventName: a.description,
            date: a.date,
            status: a.status,
          }))
        );
        const sales = await getRecentSales(5);
        setRecentSales(sales);
      } catch (e) {
        setError("Failed to load dashboard data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {loading && <div>Loading Dashboard...</div>}
      {!loading && error && <div className="text-red-500">{error}</div>}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Photographer Dashboard</h2>
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
            <Button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold">Withdraw</Button>
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
                      <Badge
                        variant={event.status === 'Completed' || event.status === 'Ongoing' ? 'default' : 'outline'}
                        className={event.status === 'Ongoing' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                      >
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
                    <p className="text-sm font-medium leading-none">{sale.event}</p>
                    <p className="text-xs text-muted-foreground">{new Date(sale.date).toISOString().split('T')[0]}</p>
                  </div>
                  <div className="ml-auto font-medium">{sale.amount} รูป</div>
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
