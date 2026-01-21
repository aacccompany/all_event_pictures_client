import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const RecentEvents = ({ events, className }) => {
  return (
    <Card className={` ${className}`} x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>Recent events you have created.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Photos</TableHead>
              <TableHead className="text-right">Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.name}>
                  <TableCell>
                    <div className="font-medium">{event.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {event.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="text-xs"
                      variant={event.status === "Completed" ? "outline" : "secondary"}
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{event.photos}</TableCell>
                  <TableCell className="text-right">{event.sales}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="4" className="text-center">
                  No recent events
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentEvents;
