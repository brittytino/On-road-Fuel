import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LogOut,
  Bell,
  Settings,
  Home,
  Fuel,
  Users,
  FileText,
  AlertTriangle,
  Sun,
  Moon,
  BarChart,
  Activity,
  Truck,
} from 'lucide-react';
import { getNotifications } from '../utils/localStorage';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, active }) => (
  <Button
    onClick={onClick}
    variant={active ? "default" : "ghost"}
    className="w-full justify-start"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
);

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = user ? getNotifications(user.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const getNavItems = () => {
    const baseItems = [
      {
        icon: <Home className="h-5 w-5" />,
        label: 'Dashboard',
        path: '/dashboard',
      },
    ];

    const roleSpecificItems = {
      admin: [
        {
          icon: <Users className="h-5 w-5" />,
          label: 'Users',
          path: '/dashboard/users',
        },
        {
          icon: <Fuel className="h-5 w-5" />,
          label: 'Stations',
          path: '/dashboard/stations',
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: 'Requests',
          path: '/dashboard/requests',
        },
        {
          icon: <BarChart className="h-5 w-5" />,
          label: 'Analytics',
          path: '/dashboard/analytics',
        },
        {
          icon: <Activity className="h-5 w-5" />,
          label: 'System Health',
          path: '/dashboard/system',
        },
      ],
      user: [
        {
          icon: <Truck className="h-5 w-5" />,
          label: 'Request Fuel',
          path: '/dashboard/request',
        },
        {
          icon: <FileText className="h-5 w-5" />,
          label: 'My Requests',
          path: '/dashboard/my-requests',
        },
      ],
      station: [
        {
          icon: <AlertTriangle className="h-5 w-5" />,
          label: 'Pending Requests',
          path: '/dashboard/pending',
        },
        {
          icon: <Fuel className="h-5 w-5" />,
          label: 'Inventory',
          path: '/dashboard/inventory',
        },
      ],
    };

    return [...baseItems, ...(user ? roleSpecificItems[user.role] : [])];
  };

  return (
    <div className="min-h-screen bg-background flex dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">Fuel Delivery</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {getNavItems().map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              onClick={() => navigate(item.path)}
              active={location.pathname === item.path}
            />
          ))}
        </div>

        <div className="p-4 border-t">
          <NavItem
            icon={<LogOut className="h-5 w-5" />}
            label="Logout"
            onClick={logout}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user?.profile.fullName}
          </h2>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    <AvatarFallback>
                      {user?.profile.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.profile.fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.profile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};