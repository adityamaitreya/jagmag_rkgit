import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, AlertCircle, MapPin, Calendar } from 'lucide-react';

// Mock data for dashboard
const issueStats = {
  total: 124,
  open: 42,
  inProgress: 28,
  resolved: 54,
};

const recentReports = [
  {
    id: 'REP-1234',
    location: '123 Main St, Downtown',
    status: 'open',
    reportedAt: '2023-09-15T10:30:00',
    description: 'Streetlight completely out, area is very dark at night',
  },
  {
    id: 'REP-1235',
    location: '456 Oak Ave, Westside',
    status: 'in_progress',
    reportedAt: '2023-09-14T14:45:00',
    description: 'Light flickering, potential electrical issue',
  },
  {
    id: 'REP-1236',
    location: '789 Pine Rd, Northside',
    status: 'resolved',
    reportedAt: '2023-09-13T09:15:00',
    description: 'Light pole damaged after vehicle collision',
  },
  {
    id: 'REP-1237',
    location: '321 Elm St, Eastside',
    status: 'open',
    reportedAt: '2023-09-12T18:20:00',
    description: 'Multiple lights out on the street, safety concern',
  },
];

const chartData = [
  { name: 'Mon', issues: 12 },
  { name: 'Tue', issues: 19 },
  { name: 'Wed', issues: 15 },
  { name: 'Thu', issues: 8 },
  { name: 'Fri', issues: 22 },
  { name: 'Sat', issues: 14 },
  { name: 'Sun', issues: 10 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <Badge variant="destructive">Open</Badge>;
    case 'in_progress':
      return <Badge variant="warning">In Progress</Badge>;
    case 'resolved':
      return <Badge variant="outline">Resolved</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issueStats.total}</div>
              <p className="text-xs text-muted-foreground">All reported issues</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issueStats.open}</div>
              <Progress value={(issueStats.open / issueStats.total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{Math.round((issueStats.open / issueStats.total) * 100)}% of total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issueStats.inProgress}</div>
              <Progress value={(issueStats.inProgress / issueStats.total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{Math.round((issueStats.inProgress / issueStats.total) * 100)}% of total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issueStats.resolved}</div>
              <Progress value={(issueStats.resolved / issueStats.total) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{Math.round((issueStats.resolved / issueStats.total) * 100)}% of total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Weekly Issue Reports</CardTitle>
              <CardDescription>Number of issues reported in the past week</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="issues" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest streetlight outage reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{report.id}</div>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="text-sm mb-2">{report.description}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="mr-3">{report.location}</span>
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(report.reportedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for new features */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Welcome to the new dashboard!</AlertTitle>
          <AlertDescription>
            We've updated the admin interface with new features. Explore the sidebar to access all management tools.
          </AlertDescription>
        </Alert>
      </div>
    </DashboardLayout>
  );
};

export default Index;