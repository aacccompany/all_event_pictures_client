import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router"

const RecentSales = ({ sales, className, viewAllPath = "/org/detailed-sales" }) => {
  return (
    <Card className={` ${className}`} x-chunk="dashboard-01-chunk-5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="grid gap-1">
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>Recent sales from your events.</CardDescription>
        </div>
        <Link to={viewAllPath} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </CardHeader>
      <CardContent className="grid gap-6">
        {sales.length > 0 ? (
          sales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4">
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{sale.event}</p>
                <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="font-medium text-green-600">
                  ฿{sale.earnings ? sale.earnings.toFixed(2) : "0.00"}
                </div>
                <div className="text-xs text-muted-foreground">{sale.amount} Photos</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            No recent sales
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSales;
