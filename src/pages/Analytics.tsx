
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChartHorizontal, PieChart, LineChart, BarChart, Calendar, Download, Share, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useToast } from "@/hooks/use-toast";
import { Chart } from "@/components/ui/chart";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");
  const [chartType, setChartType] = useState("bar");
  const { data, isLoading } = useAnalyticsData(dateRange);
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Feature coming soon",
      description: "Export functionality will be available in a future update.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Feature coming soon",
      description: "Share functionality will be available in a future update.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Feature coming soon",
      description: "Print functionality will be available in a future update.",
    });
  };

  // Render chart based on selected type
  const renderChart = () => {
    if (isLoading) {
      return <div className="flex justify-center py-12">Loading...</div>;
    }

    return <Chart type={chartType} data={data} />;
  };

  return (
    <div className="container px-4 mx-auto max-w-7xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            View and analyze program performance metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{data?.summary?.recentIncrease || 0}% from last {dateRange}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.summary?.completionRate || 0}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <CardDescription>Current</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary?.active || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Processing</CardTitle>
            <CardDescription>Time to completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.summary?.averageDays || 0} days</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle>Data Visualization</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[120px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Tabs value={chartType} onValueChange={setChartType} className="w-fit">
                  <TabsList className="grid grid-cols-4 w-fit">
                    <TabsTrigger value="bar" className="px-3">
                      <BarChart className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="line" className="px-3">
                      <LineChart className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="pie" className="px-3">
                      <PieChart className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="horizontal" className="px-3">
                      <BarChartHorizontal className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-8">
            <div className="h-[400px] w-full">{renderChart()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
