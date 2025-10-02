import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  const RecentSales = ({ sales }) => {
    return (
      <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          {sales.length > 0 ? (
            sales.map((sale) => (
              <div key={sale.email} className="flex items-center gap-4">
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{sale.name}</p>
                  <p className="text-sm text-muted-foreground">{sale.email}</p>
                </div>
                <div className="ml-auto font-medium">{sale.amount}</div>
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