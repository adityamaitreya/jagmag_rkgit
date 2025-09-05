import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Shield,
  LogOut,
  User,
  Menu,
  Home,
  AlertTriangle,
  Users,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const NavItems = () => (
    <div className="flex flex-col space-y-1">
      <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
        <Home className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      <Link to="/issues" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
        <AlertTriangle className="h-5 w-5" />
        <span>Issue Management</span>
      </Link>
      {profile?.role === 'super_admin' && (
        <Link to="/users" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
          <Users className="h-5 w-5" />
          <span>User Management</span>
        </Link>
      )}
      <Link to="/notifications" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
        <Bell className="h-5 w-5" />
        <span>Notifications</span>
      </Link>
      {profile?.role === 'super_admin' && (
        <Link to="/settings" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className="w-64 border-r border-border bg-card p-4 flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="h-10 w-10" />
            <h1 className="text-xl font-bold">JAGMAG Dashboard</h1>
          </div>
          <NavItems />
          <div className="mt-auto pt-4">
            <Separator className="mb-4" />
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {profile?.full_name || user?.email}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded capitalize">
                {profile?.role?.replace('_', ' ')}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card p-4">
          <div className="flex justify-between items-center">
            {isMobile && (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex items-center space-x-2 mb-6">
                    <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="h-10 w-10" />
                    <h1 className="text-xl font-bold">JAGMAG Dashboard</h1>
                  </div>
                  <NavItems />
                  <div className="mt-8 pt-4">
                    <Separator className="mb-4" />
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {profile?.full_name || user?.email}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded capitalize">
                        {profile?.role?.replace('_', ' ')}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {isMobile && (
              <div className="flex items-center space-x-2">
                <img src="/jagmag-logo.svg" alt="JAGMAG Logo" className="h-8 w-8" />
                <h1 className="text-lg font-bold">JAGMAG Dashboard</h1>
              </div>
            )}
            {!isMobile && <div />}
            <div className="flex items-center space-x-2">
              {isMobile && (
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;