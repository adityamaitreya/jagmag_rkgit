import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Shield, AlertCircle, CheckCircle, MoreHorizontal, FileText, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSupabaseQuery, useSupabaseMutation } from '@/hooks/useSupabase';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  reportCount: number;
}

// Define types for our data
type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  reportCount?: number; // This would need to be calculated or joined from another table
};

// We'll use mock reports data since there's no reports table in Supabase yet
const mockUsers = [
  {
    id: 'USR-1001',
    email: 'john.doe@example.com',
    fullName: 'John Doe',
    role: 'user',
    isActive: true,
    createdAt: '2023-08-10T14:30:00',
    reportCount: 5,
  },
  {
    id: 'USR-1002',
    email: 'jane.smith@example.com',
    fullName: 'Jane Smith',
    role: 'user',
    isActive: true,
    createdAt: '2023-08-15T09:45:00',
    reportCount: 3,
  },
  {
    id: 'USR-1004',
    email: 'robert.johnson@example.com',
    fullName: 'Robert Johnson',
    role: 'user',
    isActive: false,
    createdAt: '2023-08-20T16:15:00',
    reportCount: 2,
  },
  {
    id: 'USR-1005',
    email: 'admin2@lightguard.com',
    fullName: 'Admin Two',
    role: 'admin',
    isActive: true,
    createdAt: '2023-07-10T13:40:00',
    reportCount: 0,
  },
  {
    id: 'USR-1006',
    email: 'sarah.williams@example.com',
    fullName: 'Sarah Williams',
    role: 'user',
    isActive: true,
    createdAt: '2023-08-25T10:30:00',
    reportCount: 7,
  },
  {
    id: 'USR-1007',
    email: 'super.admin@lightguard.com',
    fullName: 'Super Admin',
    role: 'super_admin',
    isActive: true,
    createdAt: '2023-06-01T09:00:00',
    reportCount: 0,
  },
];

// Mock data for user reports - we'll keep this until we have a reports table in Supabase
const mockReports = [
  {
    id: 'REP-1234',
    userId: 'USR-1001',
    location: '123 Main St, Downtown',
    status: 'open',
    reportedAt: '2023-09-15T10:30:00',
  },
  {
    id: 'REP-1235',
    userId: 'USR-1001',
    location: '456 Oak Ave, Westside',
    status: 'in_progress',
    reportedAt: '2023-09-14T14:45:00',
  },
  {
    id: 'REP-1236',
    userId: 'USR-1002',
    location: '789 Pine Rd, Northside',
    status: 'resolved',
    reportedAt: '2023-09-13T09:15:00',
  },
  {
    id: 'REP-1237',
    userId: 'USR-1001',
    location: '321 Elm St, Eastside',
    status: 'open',
    reportedAt: '2023-09-12T18:20:00',
  },
  {
    id: 'REP-1238',
    userId: 'USR-1002',
    location: '555 Maple Dr, Southside',
    status: 'in_progress',
    reportedAt: '2023-09-11T11:10:00',
  },
  {
    id: 'REP-1239',
    userId: 'USR-1001',
    location: '777 Cedar Blvd, Westside',
    status: 'resolved',
    reportedAt: '2023-09-10T15:30:00',
  },
  {
    id: 'REP-1240',
    userId: 'USR-1001',
    location: '888 Birch Ave, Downtown',
    status: 'resolved',
    reportedAt: '2023-09-09T13:45:00',
  },
  {
    id: 'REP-1241',
    userId: 'USR-1002',
    location: '999 Willow St, Eastside',
    status: 'open',
    reportedAt: '2023-09-08T09:20:00',
  },
  {
    id: 'REP-1242',
    userId: 'USR-1006',
    location: '111 Spruce Rd, Northside',
    status: 'open',
    reportedAt: '2023-09-07T16:10:00',
  },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'super_admin':
      return <Badge className="bg-purple-500 hover:bg-purple-600">Super Admin</Badge>;
    case 'admin':
      return <Badge variant="default">Admin</Badge>;
    case 'user':
      return <Badge variant="secondary">User</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

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
    year: 'numeric',
  });
};

const UserManagement = () => {
  // Use Supabase hook to fetch profiles
  const { data: profiles, loading: isLoading, error, refetch } = useSupabaseQuery<Profile>('profiles');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Convert Supabase profiles to our user format
  const users: User[] = (profiles || []).map(profile => ({
    id: profile.id,
    email: profile.email || '',
    fullName: profile.full_name || 'No Name',
    role: (profile.role as User['role']) || 'user',
    isActive: profile.is_active !== undefined ? profile.is_active : true,
    createdAt: profile.created_at || new Date().toISOString(),
    reportCount: 0, // We don't have this data yet
  }));

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isReportsDialogOpen, setIsReportsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Handle toggling user active status
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdateLoading(true);
      // Update the profile in Supabase
      await supabaseService.updateProfile(userId, { is_active: !currentStatus });
      
      // Refresh data from Supabase
      refetch();
      
      // Update selected user if it's the one being modified
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, isActive: !currentStatus });
      }
      
      toast({
        title: 'User status updated',
        description: `User has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
    } catch (error: unknown) {
      toast({
        title: 'Error updating user status',
        description: 'There was a problem updating the user status.',
        variant: 'destructive',
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) || 
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle role change mutation
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await supabaseService.updateProfile(userId, { role: newRole as Profile['role'] });

      // Refresh data from Supabase
      refetch();

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole as User['role'] });
      }
      
      toast({
        title: 'User role updated',
        description: `User role has been changed to ${newRole}.`,
      });
    } catch (error: unknown) {
      toast({
        title: 'Error updating user role',
        description: 'There was a problem updating the user role.',
        variant: 'destructive',
      });
    }
  };

  const getUserReports = (userId: string) => {
    return mockReports.filter(report => report.userId === userId);
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const openUserReports = (user: User) => {
    setSelectedUser(user);
    setIsReportsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading users...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-destructive">
                <AlertCircle className="h-6 w-6 mr-2" />
                <p>Error loading users. Please try again later.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-destructive mr-1" />
                            <span>Blocked</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        {user.reportCount > 0 ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => openUserReports(user)}
                          >
                            <FileText className="h-4 w-4" />
                            {user.reportCount} reports
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No reports</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openUserDetails(user)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedUser.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>User ID</Label>
                <div className="text-sm font-mono bg-muted p-2 rounded">{selectedUser.id}</div>
              </div>
              
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => handleRoleChange(selectedUser.id, value)}
                  disabled={selectedUser.role === 'super_admin'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                {selectedUser.role === 'super_admin' && (
                  <p className="text-xs text-muted-foreground">Super Admin role cannot be changed</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label>Account Status</Label>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={selectedUser.isActive} 
                    onCheckedChange={() => handleToggleUserStatus(selectedUser.id, selectedUser.isActive)}
                    disabled={selectedUser.role === 'super_admin' || updateLoading}
                  />
                  <span>
                    {selectedUser.isActive ? 'Active' : 'Blocked'}
                    {updateLoading && (
                      <Loader2 className="ml-2 h-3 w-3 inline animate-spin" />
                    )}
                  </span>
                </div>
                {selectedUser.role === 'super_admin' && (
                  <p className="text-xs text-muted-foreground">Super Admin status cannot be changed</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label>Joined Date</Label>
                <div className="text-sm">{formatDate(selectedUser.createdAt)}</div>
              </div>
              
              <div className="grid gap-2">
                <Label>Reports Submitted</Label>
                <div className="text-sm">{selectedUser.reportCount} reports</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Close</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Reports Dialog */}
      <Dialog open={isReportsDialogOpen} onOpenChange={setIsReportsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>User Reports</DialogTitle>
            <DialogDescription>
              Reports submitted by {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getUserReports(selectedUser.id).map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{formatDate(report.reportedAt)}</TableCell>
                      </TableRow>
                    ))}
                    {getUserReports(selectedUser.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No reports found for this user
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;