
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DashboardIcon, ListingIcon, LogOutIcon, ArrowLeftIcon, UsersIcon, GlobeAltIcon, PlusCircleIcon } from '../../components/IconComponents';

const SuperAdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`;

  const sidebarLinks = (
      <>
        <NavLink to="/superadmin/dashboard" className={navLinkClasses} end>
            <DashboardIcon className="h-5 w-5" />
            <span>Dashboard</span>
        </NavLink>
        <NavLink to="/superadmin/users" className={navLinkClasses} end>
            <UsersIcon className="h-5 w-5" />
            <span>Manage Users</span>
        </NavLink>
        <NavLink to="/superadmin/listings" className={navLinkClasses} end>
            <ListingIcon className="h-5 w-5" />
            <span>Manage Listings</span>
        </NavLink>
         <NavLink to="/superadmin/listings/add" className={navLinkClasses}>
            <PlusCircleIcon className="h-5 w-5" />
            <span>Add Vehicle</span>
        </NavLink>
        <NavLink to="/superadmin/content" className={navLinkClasses}>
            <GlobeAltIcon className="h-5 w-5" />
            <span>Site Content</span>
        </NavLink>
      </>
  );

  return (
    <div className="bg-background min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
             <div className="bg-secondary p-3 rounded-lg border border-border space-y-2">
                <div className="px-4 py-3 mb-2 border-b border-border">
                    <p className="font-semibold text-foreground truncate">{user?.fname} {user?.lname}</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
                </div>
                {sidebarLinks}
                <div className="pt-2 border-t border-border !mt-4">
                    <NavLink to="/" className={navLinkClasses({ isActive: false })}>
                        <ArrowLeftIcon className="h-5 w-5"/>
                        <span>Back to Site</span>
                    </NavLink>
                    <button onClick={handleLogout} className={`w-full ${navLinkClasses({ isActive: false })}`}>
                        <LogOutIcon className="h-5 w-5"/>
                        <span>Logout</span>
                    </button>
                </div>
             </div>
          </aside>
          
          <main className="md:col-span-3">
              <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
