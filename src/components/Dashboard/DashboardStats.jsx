import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Baht, Calendar } from "lucide-react"
  
  const DashboardStats = ({ stats }) => {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
          <CardHeader className="pb-3">
            <CardTitle>Your Photographer Dashboard</CardTitle>
            <p className="max-w-lg text-balance leading-relaxed">
              Manage your events, photos, and earnings.
            </p>
          </CardHeader>
        </Card>
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents.value}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEvents.change}
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Baht className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEarnings.value}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEarnings.change}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default DashboardStats;