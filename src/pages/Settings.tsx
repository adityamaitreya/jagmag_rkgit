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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { Shield, User, Trash2, PlusCircle, Palette, Settings as SettingsIcon, Tag, Users, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

// Mock data for admins
const mockAdmins = [
  {
    id: 'ADM-1001',
    email: 'admin1@lightguard.com',
    fullName: 'Admin One',
    role: 'admin',
    isActive: true,
    createdAt: '2023-07-05T11:20:00',
    lastLogin: '2023-09-15T09:30:00',
  },
  {
    id: 'ADM-1002',
    email: 'admin2@lightguard.com',
    fullName: 'Admin Two',
    role: 'admin',
    isActive: true,
    createdAt: '2023-07-10T13:40:00',
    lastLogin: '2023-09-14T14:15:00',
  },
  {
    id: 'ADM-1003',
    email: 'super.admin@lightguard.com',
    fullName: 'Super Admin',
    role: 'super_admin',
    isActive: true,
    createdAt: '2023-06-01T09:00:00',
    lastLogin: '2023-09-16T10:45:00',
  },
];

// Mock data for issue categories
const mockCategories = [
  {
    id: 'CAT-1001',
    name: 'Light Out',
    description: 'Streetlight is completely out',
    color: '#FF5555',
    isActive: true,
  },
  {
    id: 'CAT-1002',
    name: 'Flickering',
    description: 'Streetlight is flickering',
    color: '#FFAA00',
    isActive: true,
  },
  {
    id: 'CAT-1003',
    name: 'Damaged Pole',
    description: 'Streetlight pole is damaged',
    color: '#AA5555',
    isActive: true,
  },
  {
    id: 'CAT-1004',
    name: 'Exposed Wiring',
    description: 'Exposed wiring on streetlight',
    color: '#FF0000',
    isActive: true,
  },
  {
    id: 'CAT-1005',
    name: 'Dim Light',
    description: 'Streetlight is dim or weak',
    color: '#AAAA00',
    isActive: true,
  },
];

// Mock branding settings
const initialBrandingSettings = {
  appName: 'LightGuard',
  logoUrl: '/logo.svg',
  primaryColor: '#0284c7',
  secondaryColor: '#0ea5e9',
  accentColor: '#38bdf8',
  darkMode: true,
  customCss: '',
};

// Mock email settings
const initialEmailSettings = {
  senderName: 'LightGuard Admin',
  senderEmail: 'notifications@lightguard.com',
  smtpServer: 'smtp.example.com',
  smtpPort: '587',
  smtpUsername: 'smtp_user',
  smtpPassword: '********',
  enableSsl: true,
};

// Mock general settings
const initialGeneralSettings = {
  siteName: 'Streetlight Outage Reporter',
  siteDescription: 'Report and track streetlight outages in your community',
  contactEmail: 'contact@lightguard.com',
  supportPhone: '(555) 123-4567',
  enableRegistration: true,
  requireApproval: true,
  defaultUserRole: 'user',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Settings = () => {
  const [admins, setAdmins] = useState(mockAdmins);
  const [categories, setCategories] = useState(mockCategories);
  const [brandingSettings, setBrandingSettings] = useState(initialBrandingSettings);
  const [emailSettings, setEmailSettings] = useState(initialEmailSettings);
  const [generalSettings, setGeneralSettings] = useState(initialGeneralSettings);
  
  const [isNewAdminOpen, setIsNewAdminOpen] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
  });
  
  const { toast } = useToast();

  const handleBrandingChange = (field: string, value: unknown) => {
    setBrandingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field: string, value: unknown) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneralChange = (field: string, value: unknown) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNewAdminChange = (field: string, value: string) => {
    setNewAdmin(prev => ({ ...prev, [field]: value }));
  };

  const handleNewCategoryChange = (field: string, value: unknown) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAdmin = () => {
    // Validate form
    if (!newAdmin.email || !newAdmin.fullName || !newAdmin.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Create new admin
    const now = new Date();
    const newId = `ADM-${1000 + admins.length + 1}`;
    
    const admin = {
      id: newId,
      email: newAdmin.email,
      fullName: newAdmin.fullName,
      role: 'admin',
      isActive: true,
      createdAt: now.toISOString(),
      lastLogin: null,
    };
    
    setAdmins([...admins, admin]);
    setIsNewAdminOpen(false);
    setNewAdmin({
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
    });
    
    toast({
      title: "Success",
      description: "Admin added successfully",
    });
  };

  const handleAddCategory = () => {
    // Validate form
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Create new category
    const newId = `CAT-${1000 + categories.length + 1}`;
    
    const category = {
      id: newId,
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      isActive: newCategory.isActive,
    };
    
    setCategories([...categories, category]);
    setIsNewCategoryOpen(false);
    setNewCategory({
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
    });
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleToggleAdminStatus = (adminId: string) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId ? { ...admin, isActive: !admin.isActive } : admin
    ));
  };

  const handleToggleCategoryStatus = (categoryId: string) => {
    setCategories(categories.map(category => 
      category.id === categoryId ? { ...category, isActive: !category.isActive } : category
    ));
  };

  const handleDeleteAdmin = (adminId: string) => {
    // Don't allow deleting super_admin
    const adminToDelete = admins.find(admin => admin.id === adminId);
    if (adminToDelete?.role === 'super_admin') {
      toast({
        title: "Error",
        description: "Cannot delete Super Admin account",
        variant: "destructive",
      });
      return;
    }
    
    setAdmins(admins.filter(admin => admin.id !== adminId));
    toast({
      title: "Success",
      description: "Admin deleted successfully",
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(category => category.id !== categoryId));
    toast({
      title: "Success",
      description: "Category deleted successfully",
    });
  };

  const handleSaveSettings = (settingsType: string) => {
    toast({
      title: "Success",
      description: `${settingsType} settings saved successfully`,
    });
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Palette className="h-4 w-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tag className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="admins">
              <Users className="h-4 w-4 mr-2" />
              Admins
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input 
                        id="siteName" 
                        value={generalSettings.siteName}
                        onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) => handleGeneralChange('contactEmail', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea 
                      id="siteDescription" 
                      value={generalSettings.siteDescription}
                      onChange={(e) => handleGeneralChange('siteDescription', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input 
                        id="supportPhone" 
                        value={generalSettings.supportPhone}
                        onChange={(e) => handleGeneralChange('supportPhone', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="defaultUserRole">Default User Role</Label>
                      <Select 
                        value={generalSettings.defaultUserRole} 
                        onValueChange={(value) => handleGeneralChange('defaultUserRole', value)}
                      >
                        <SelectTrigger id="defaultUserRole">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableRegistration">Enable User Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                      </div>
                      <Switch 
                        id="enableRegistration" 
                        checked={generalSettings.enableRegistration}
                        onCheckedChange={(checked) => handleGeneralChange('enableRegistration', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="requireApproval">Require Admin Approval</Label>
                        <p className="text-sm text-muted-foreground">New accounts require admin approval before activation</p>
                      </div>
                      <Switch 
                        id="requireApproval" 
                        checked={generalSettings.requireApproval}
                        onCheckedChange={(checked) => handleGeneralChange('requireApproval', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={() => handleSaveSettings('General')}>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="senderName">Sender Name</Label>
                      <Input 
                        id="senderName" 
                        value={emailSettings.senderName}
                        onChange={(e) => handleEmailChange('senderName', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="senderEmail">Sender Email</Label>
                      <Input 
                        id="senderEmail" 
                        type="email"
                        value={emailSettings.senderEmail}
                        onChange={(e) => handleEmailChange('senderEmail', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input 
                        id="smtpServer" 
                        value={emailSettings.smtpServer}
                        onChange={(e) => handleEmailChange('smtpServer', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input 
                        id="smtpPort" 
                        value={emailSettings.smtpPort}
                        onChange={(e) => handleEmailChange('smtpPort', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input 
                        id="smtpUsername" 
                        value={emailSettings.smtpUsername}
                        onChange={(e) => handleEmailChange('smtpUsername', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input 
                        id="smtpPassword" 
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => handleEmailChange('smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableSsl">Enable SSL/TLS</Label>
                      <p className="text-sm text-muted-foreground">Use secure connection for email</p>
                    </div>
                    <Switch 
                      id="enableSsl" 
                      checked={emailSettings.enableSsl}
                      onCheckedChange={(checked) => handleEmailChange('enableSsl', checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Test Connection</Button>
                <Button onClick={() => handleSaveSettings('Email')}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Branding Settings Tab */}
          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Branding Settings</CardTitle>
                <CardDescription>Customize the look and feel of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="appName">Application Name</Label>
                      <Input 
                        id="appName" 
                        value={brandingSettings.appName}
                        onChange={(e) => handleBrandingChange('appName', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input 
                        id="logoUrl" 
                        value={brandingSettings.logoUrl}
                        onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded-md border" 
                          style={{ backgroundColor: brandingSettings.primaryColor }}
                        />
                        <Input 
                          value={brandingSettings.primaryColor}
                          onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded-md border" 
                          style={{ backgroundColor: brandingSettings.secondaryColor }}
                        />
                        <Input 
                          value={brandingSettings.secondaryColor}
                          onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded-md border" 
                          style={{ backgroundColor: brandingSettings.accentColor }}
                        />
                        <Input 
                          value={brandingSettings.accentColor}
                          onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode">Enable Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Allow users to switch to dark mode</p>
                    </div>
                    <Switch 
                      id="darkMode" 
                      checked={brandingSettings.darkMode}
                      onCheckedChange={(checked) => handleBrandingChange('darkMode', checked)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="customCss">Custom CSS</Label>
                    <Textarea 
                      id="customCss" 
                      className="font-mono text-sm h-32"
                      placeholder="/* Add your custom CSS here */"
                      value={brandingSettings.customCss}
                      onChange={(e) => handleBrandingChange('customCss', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" className="mr-2">Preview</Button>
                <Button onClick={() => handleSaveSettings('Branding')}>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Issue Categories</CardTitle>
                  <CardDescription>Manage categories for issue reporting</CardDescription>
                </div>
                <Button onClick={() => setIsNewCategoryOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-4 w-4 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-xs font-mono">{category.color}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={category.isActive}
                              onCheckedChange={() => handleToggleCategoryStatus(category.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Admins Tab */}
          <TabsContent value="admins" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Admin Management</CardTitle>
                  <CardDescription>Manage admin users and permissions</CardDescription>
                </div>
                <Button onClick={() => setIsNewAdminOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Admin
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.fullName}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>
                            {admin.role === 'super_admin' ? (
                              <Badge className="bg-purple-500 hover:bg-purple-600">Super Admin</Badge>
                            ) : (
                              <Badge>Admin</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={admin.isActive}
                              onCheckedChange={() => handleToggleAdminStatus(admin.id)}
                              disabled={admin.role === 'super_admin'}
                            />
                          </TableCell>
                          <TableCell>
                            {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={admin.role === 'super_admin'}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Admin Dialog */}
      <Dialog open={isNewAdminOpen} onOpenChange={setIsNewAdminOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new admin user account
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                placeholder="John Doe" 
                value={newAdmin.fullName}
                onChange={(e) => handleNewAdminChange('fullName', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={newAdmin.email}
                onChange={(e) => handleNewAdminChange('email', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={newAdmin.password}
                onChange={(e) => handleNewAdminChange('password', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={newAdmin.confirmPassword}
                onChange={(e) => handleNewAdminChange('confirmPassword', e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewAdminOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAdmin}>Add Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Category Dialog */}
      <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new issue category
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input 
                id="name" 
                placeholder="Light Out" 
                value={newCategory.name}
                onChange={(e) => handleNewCategoryChange('name', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Streetlight is completely out" 
                value={newCategory.description}
                onChange={(e) => handleNewCategoryChange('description', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <div 
                  className="h-6 w-6 rounded-md border" 
                  style={{ backgroundColor: newCategory.color }}
                />
                <Input 
                  id="color" 
                  value={newCategory.color}
                  onChange={(e) => handleNewCategoryChange('color', e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch 
                id="isActive" 
                checked={newCategory.isActive}
                onCheckedChange={(checked) => handleNewCategoryChange('isActive', checked)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;