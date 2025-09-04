import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Search, Calendar, User, Users, Info, CheckCheck, AlertTriangle, BellRing } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'feature' | 'assignment' | 'alert' | 'report';
  sentTo: string;
  sentAt: string;
  sentBy: string;
  readCount: number;
  totalRecipients: number;
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: 'NOT-1001',
    title: 'System Maintenance',
    message: 'The system will be down for maintenance on Saturday from 2 AM to 4 AM.',
    type: 'system',
    sentTo: 'all',
    sentAt: '2023-09-15T10:30:00',
    sentBy: 'super.admin@lightguard.com',
    readCount: 45,
    totalRecipients: 50,
  },
  {
    id: 'NOT-1002',
    title: 'New Feature: Photo Upload',
    message: 'Users can now upload photos with their streetlight outage reports.',
    type: 'feature',
    sentTo: 'all',
    sentAt: '2023-09-10T14:45:00',
    sentBy: 'super.admin@lightguard.com',
    readCount: 38,
    totalRecipients: 48,
  },
  {
    id: 'NOT-1003',
    title: 'Issue #1234 Assigned',
    message: 'You have been assigned to handle the streetlight outage at 123 Main St.',
    type: 'assignment',
    sentTo: 'admin1@lightguard.com',
    sentAt: '2023-09-08T09:15:00',
    sentBy: 'super.admin@lightguard.com',
    readCount: 1,
    totalRecipients: 1,
  },
  {
    id: 'NOT-1004',
    title: 'Urgent: Multiple Outages Reported',
    message: 'Multiple streetlight outages have been reported in the Downtown area following the storm.',
    type: 'alert',
    sentTo: 'admins',
    sentAt: '2023-09-05T18:20:00',
    sentBy: 'system',
    readCount: 3,
    totalRecipients: 5,
  },
  {
    id: 'NOT-1005',
    title: 'Monthly Report Available',
    message: 'The August 2023 streetlight maintenance report is now available for review.',
    type: 'report',
    sentTo: 'admins',
    sentAt: '2023-09-01T11:10:00',
    sentBy: 'system',
    readCount: 4,
    totalRecipients: 5,
  },
];

// Mock data for users
const mockUsers = [
  { id: 'USR-1001', email: 'john.doe@example.com', fullName: 'John Doe', role: 'user' },
  { id: 'USR-1002', email: 'jane.smith@example.com', fullName: 'Jane Smith', role: 'user' },
  { id: 'USR-1003', email: 'admin1@lightguard.com', fullName: 'Admin One', role: 'admin' },
  { id: 'USR-1004', email: 'admin2@lightguard.com', fullName: 'Admin Two', role: 'admin' },
  { id: 'USR-1005', email: 'super.admin@lightguard.com', fullName: 'Super Admin', role: 'super_admin' },
];

const getNotificationTypeBadge = (type: string) => {
  switch (type) {
    case 'system':
      return <Badge variant="outline">System</Badge>;
    case 'feature':
      return <Badge variant="secondary">Feature</Badge>;
    case 'assignment':
      return <Badge variant="default">Assignment</Badge>;
    case 'alert':
      return <Badge variant="destructive">Alert</Badge>;
    case 'report':
      return <Badge variant="warning">Report</Badge>;
    default:
      return <Badge>Other</Badge>;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewNotificationOpen, setIsNewNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'system',
    recipients: 'all',
    specificRecipient: '',
  });
  
  const { toast } = useToast();

  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailsOpen(true);
  };

  const handleNewNotificationChange = (field: string, value: string) => {
    setNewNotification(prev => ({ ...prev, [field]: value }));
  };

  const handleSendNotification = () => {
    // Validate form
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Create new notification
    const now = new Date();
    const newId = `NOT-${1000 + notifications.length + 1}`;
    
    let sentTo = newNotification.recipients;
    let totalRecipients = 0;
    
    if (newNotification.recipients === 'all') {
      totalRecipients = mockUsers.length;
    } else if (newNotification.recipients === 'admins') {
      totalRecipients = mockUsers.filter(user => user.role === 'admin' || user.role === 'super_admin').length;
    } else if (newNotification.recipients === 'specific' && newNotification.specificRecipient) {
      sentTo = newNotification.specificRecipient;
      totalRecipients = 1;
    }
    
    const notification: Notification = {
      id: newId,
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type as Notification['type'],
      sentTo: sentTo,
      sentAt: now.toISOString(),
      sentBy: 'super.admin@lightguard.com', // Assuming current user
      readCount: 0,
      totalRecipients,
    };
    
    setNotifications([notification, ...notifications]);
    setIsNewNotificationOpen(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'system',
      recipients: 'all',
      specificRecipient: '',
    });
    
    toast({
      title: "Success",
      description: "Notification sent successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <Button onClick={() => setIsNewNotificationOpen(true)}>
            <BellRing className="mr-2 h-4 w-4" />
            Send Notification
          </Button>
        </div>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Notification History</TabsTrigger>
            <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>View all sent notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Sent To</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead>Read</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {notification.message}
                            </div>
                          </TableCell>
                          <TableCell>{getNotificationTypeBadge(notification.type)}</TableCell>
                          <TableCell>
                            {notification.sentTo === 'all' ? (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>All Users</span>
                              </div>
                            ) : notification.sentTo === 'admins' ? (
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>All Admins</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="truncate max-w-[150px]">{notification.sentTo}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(notification.sentAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CheckCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>
                                {notification.readCount}/{notification.totalRecipients}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(notification)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredNotifications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No notifications found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Email Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email" defaultChecked />
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Send notifications via email
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>In-App Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="in-app" defaultChecked />
                      <label
                        htmlFor="in-app"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Show notifications in-app
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Notification Types</Label>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="system-notif" defaultChecked />
                        <label
                          htmlFor="system-notif"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          System notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="feature-notif" defaultChecked />
                        <label
                          htmlFor="feature-notif"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Feature announcements
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="assignment-notif" defaultChecked />
                        <label
                          htmlFor="assignment-notif"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Assignment notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-notif" defaultChecked />
                        <label
                          htmlFor="alert-notif"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Alert notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="report-notif" defaultChecked />
                        <label
                          htmlFor="report-notif"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Report notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notification Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>
              View detailed information about this notification
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Notification ID</Label>
                <div className="text-sm font-mono bg-muted p-2 rounded">{selectedNotification.id}</div>
              </div>
              
              <div className="grid gap-2">
                <Label>Title</Label>
                <div className="text-lg font-medium">{selectedNotification.title}</div>
              </div>
              
              <div className="grid gap-2">
                <Label>Message</Label>
                <div className="text-sm border rounded-md p-3 bg-muted/50">
                  {selectedNotification.message}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <div>{getNotificationTypeBadge(selectedNotification.type)}</div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Sent At</Label>
                  <div className="text-sm">{formatDate(selectedNotification.sentAt)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Sent By</Label>
                  <div className="text-sm">{selectedNotification.sentBy}</div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Sent To</Label>
                  <div className="text-sm">
                    {selectedNotification.sentTo === 'all' ? 'All Users' : 
                     selectedNotification.sentTo === 'admins' ? 'All Admins' : 
                     selectedNotification.sentTo}
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Read Status</Label>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ 
                        width: `${(selectedNotification.readCount / selectedNotification.totalRecipients) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm whitespace-nowrap">
                    {selectedNotification.readCount}/{selectedNotification.totalRecipients} read
                    ({Math.round((selectedNotification.readCount / selectedNotification.totalRecipients) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Notification Dialog */}
      <Dialog open={isNewNotificationOpen} onOpenChange={setIsNewNotificationOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send New Notification</DialogTitle>
            <DialogDescription>
              Create and send a new notification to users
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Notification title" 
                value={newNotification.title}
                onChange={(e) => handleNewNotificationChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Notification message" 
                className="min-h-[100px]"
                value={newNotification.message}
                onChange={(e) => handleNewNotificationChange('message', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select 
                value={newNotification.type} 
                onValueChange={(value) => handleNewNotificationChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="feature">Feature</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select 
                value={newNotification.recipients} 
                onValueChange={(value) => handleNewNotificationChange('recipients', value)}
              >
                <SelectTrigger id="recipients">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admins">All Admins</SelectItem>
                  <SelectItem value="specific">Specific User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newNotification.recipients === 'specific' && (
              <div className="grid gap-2">
                <Label htmlFor="specificRecipient">Specific Recipient</Label>
                <Select 
                  value={newNotification.specificRecipient} 
                  onValueChange={(value) => handleNewNotificationChange('specificRecipient', value)}
                >
                  <SelectTrigger id="specificRecipient">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.email}>
                        {user.fullName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewNotificationOpen(false)}>Cancel</Button>
            <Button onClick={handleSendNotification}>Send Notification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Notifications;