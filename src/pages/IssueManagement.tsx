import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Clock, Filter, MapPin, MoreHorizontal, Search, User, Image as ImageIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Issue {
  id: string;
  location: string;
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  reportedAt: string;
  description: string;
  reportedBy: string;
  assignedTo: string | null;
  hasPhoto: boolean;
}

// Mock data for issues
const mockIssues: Issue[] = [
  {
    id: 'ISS-1001',
    location: '123 Main St, Downtown',
    status: 'open',
    priority: 'high',
    reportedAt: '2023-09-15T10:30:00',
    description: 'Streetlight completely out, area is very dark at night',
    reportedBy: 'john.doe@example.com',
    assignedTo: null,
    hasPhoto: true,
  },
  {
    id: 'ISS-1002',
    location: '456 Oak Ave, Westside',
    status: 'in_progress',
    priority: 'medium',
    reportedAt: '2023-09-14T14:45:00',
    description: 'Light flickering, potential electrical issue',
    reportedBy: 'jane.smith@example.com',
    assignedTo: 'admin1@lightguard.com',
    hasPhoto: true,
  },
  {
    id: 'ISS-1003',
    location: '789 Pine Rd, Northside',
    status: 'resolved',
    priority: 'medium',
    reportedAt: '2023-09-13T09:15:00',
    description: 'Light pole damaged after vehicle collision',
    reportedBy: 'robert.johnson@example.com',
    assignedTo: 'admin2@lightguard.com',
    hasPhoto: true,
  },
  {
    id: 'ISS-1004',
    location: '321 Elm St, Eastside',
    status: 'open',
    priority: 'high',
    reportedAt: '2023-09-12T18:20:00',
    description: 'Multiple lights out on the street, safety concern',
    reportedBy: 'sarah.williams@example.com',
    assignedTo: null,
    hasPhoto: false,
  },
  {
    id: 'ISS-1005',
    location: '555 Maple Dr, Southside',
    status: 'in_progress',
    priority: 'low',
    reportedAt: '2023-09-11T11:10:00',
    description: 'Light on during daytime, wasting electricity',
    reportedBy: 'michael.brown@example.com',
    assignedTo: 'admin1@lightguard.com',
    hasPhoto: false,
  },
];

// Mock data for admins
const mockAdmins = [
  { id: 1, email: 'admin1@lightguard.com', name: 'Admin One' },
  { id: 2, email: 'admin2@lightguard.com', name: 'Admin Two' },
  { id: 3, email: 'admin3@lightguard.com', name: 'Admin Three' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <Badge variant="destructive">Open</Badge>;
    case 'in_progress':
      return <Badge variant="warning">In Progress</Badge>;
    case 'resolved':
      return <Badge variant="outline">Resolved</Badge>;
    case 'rejected':
      return <Badge variant="secondary">Rejected</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">High</Badge>;
    case 'medium':
      return <Badge variant="warning">Medium</Badge>;
    case 'low':
      return <Badge variant="outline">Low</Badge>;
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

const IssueManagement = () => {
  const [issues, setIssues] = useState(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const { toast } = useToast();

  const filteredIssues = issues.filter(issue => {
    // Search filter
    const matchesSearch = 
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    // Priority filter
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      // Check if we're using mock data (no database connection yet)
      const isMockData = issues === mockIssues;
      
      if (!isMockData) {
        // Update in the database
        await supabaseService.updateData('issues', issueId, { status: newStatus }, 'id');
      } else {
        // If using mock data, simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // For demo purposes, throw an error to show the error toast
        throw new Error('Cannot update status: The issues table does not exist in the database. This is demo data.');
      }
      
      // Update local state
      setIssues(issues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus as Issue['status'] } : issue
      ));
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({ ...selectedIssue, status: newStatus as Issue['status'] });
      }
      
      // Show success toast
      toast({
        title: 'Status Updated',
        description: `Issue ${issueId} has been marked as ${newStatus.replace('_', ' ')}.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating issue status:', error);
      // Show error toast with more specific information
      const errorMessage = error instanceof Error ? error.message : 'There was an error updating the issue status.';
      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleAssignAdmin = async (issueId: string, adminEmail: string) => {
    try {
      // Check if we're using mock data (no database connection yet)
      const isMockData = issues === mockIssues;
      
      if (!isMockData) {
        // Update in the database
        await supabaseService.updateData('issues', issueId, { assignedTo: adminEmail }, 'id');
      } else {
        // If using mock data, simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // For demo purposes, throw an error to show the error toast
        throw new Error('Cannot assign admin: The issues table does not exist in the database. This is demo data.');
      }
      
      // Update local state
      setIssues(issues.map(issue => 
        issue.id === issueId ? { ...issue, assignedTo: adminEmail } : issue
      ));
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({ ...selectedIssue, assignedTo: adminEmail });
      }
      
      // Show success toast
      toast({
        title: 'Admin Assigned',
        description: adminEmail ? `Issue ${issueId} has been assigned to ${adminEmail}.` : `Issue ${issueId} has been unassigned.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error assigning admin:', error);
      // Show error toast with more specific information
      const errorMessage = error instanceof Error ? error.message : 'There was an error assigning the admin to this issue.';
      toast({
        title: 'Assignment Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };
  
  // Function to fetch issues from the database
  const fetchIssues = async () => {
    try {
      const data = await supabaseService.fetchData<Issue>('issues');
      if (data && data.length > 0) {
        setIssues(data);
      } else {
        // If no data is returned, use mock data
        console.log('No issues found in database, using mock data');
        setIssues(mockIssues);
      }
    } catch (error) {
      console.error('Error fetching issues:', error);
      // Show error toast with more information
      toast({
        title: 'Data Loading Notice',
        description: 'Using demo data. The issues table may not exist in the database yet.',
        variant: 'default',
      });
      // Fallback to mock data if there's an error
      setIssues(mockIssues);
    }
  };
  
  // Load issues when component mounts
  useEffect(() => {
    fetchIssues();
  }, []);

  const openIssueDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Issue Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Streetlight Issues</CardTitle>
            <CardDescription>Manage and track reported streetlight outages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="truncate max-w-[200px]">{issue.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>{getPriorityBadge(issue.priority)}</TableCell>
                      <TableCell>{formatDate(issue.reportedAt)}</TableCell>
                      <TableCell>
                        {issue.assignedTo ? (
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{issue.assignedTo}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {issue.hasPhoto && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                setSelectedIssue(issue);
                                setIsPhotoOpen(true);
                              }}
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openIssueDetails(issue)}>View Details</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(issue.id, 'open')}>Mark as Open</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(issue.id, 'in_progress')}>Mark as In Progress</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(issue.id, 'resolved')}>Mark as Resolved</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(issue.id, 'rejected')}>Mark as Rejected</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Issue {selectedIssue?.id}
              {selectedIssue && getStatusBadge(selectedIssue.status)}
            </DialogTitle>
            <DialogDescription>
              Reported on {selectedIssue && formatDate(selectedIssue.reportedAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedIssue && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Location</Label>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedIssue.location}
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Description</Label>
                <div className="text-sm border rounded-md p-3 bg-muted/50">
                  {selectedIssue.description}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Reported By</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {selectedIssue.reportedBy}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <div>{getPriorityBadge(selectedIssue.priority)}</div>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select 
                  value={selectedIssue.status} 
                  onValueChange={(value) => handleStatusChange(selectedIssue.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Assign to Admin</Label>
                <Select 
                  value={selectedIssue.assignedTo || ''} 
                  onValueChange={(value) => handleAssignAdmin(selectedIssue.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an admin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {mockAdmins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.email}>
                        {admin.name} ({admin.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add notes about this issue..." />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            <Button onClick={async () => {
              if (selectedIssue) {
                try {
                  // Check if we're using mock data (no database connection yet)
                  const isMockData = issues === mockIssues;
                  
                  if (!isMockData) {
                    // Save all changes to the database
                    await supabaseService.updateData('issues', selectedIssue.id, {
                      status: selectedIssue.status,
                      assignedTo: selectedIssue.assignedTo,
                      // Add other fields that might have changed
                    });
                  } else {
                    // If using mock data, simulate a delay
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // For demo purposes, throw an error to show the error toast
                    throw new Error('Cannot save changes: The issues table does not exist in the database. This is demo data.');
                  }
                  
                  // Show success toast
                  toast({
                    title: 'Changes Saved',
                    description: `Issue ${selectedIssue.id} has been updated successfully.`,
                    variant: 'default',
                  });
                  
                  setIsDetailsOpen(false);
                  // Refresh the issues list
                  fetchIssues();
                } catch (error) {
                  console.error('Error saving changes:', error);
                  
                  // Show error toast with more specific information
                  const errorMessage = error instanceof Error ? error.message : 'There was an error saving the changes.';
                  toast({
                    title: 'Save Failed',
                    description: errorMessage,
                    variant: 'destructive',
                  });
                }
              }
            }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Photo View Dialog */}
      <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Issue Photo</DialogTitle>
            <DialogDescription>
              Photo submitted with issue {selectedIssue?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4">
            {/* Placeholder for actual photo */}
            <div className="bg-muted rounded-md w-full aspect-video flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Photo would be displayed here</p>
                <p className="text-xs text-muted-foreground">(Using placeholder as this is a demo)</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPhotoOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default IssueManagement;