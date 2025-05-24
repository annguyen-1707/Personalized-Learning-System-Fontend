import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Settings, 
  Activity, 
  Book, 
  FileText, 
  Home, 
  Layout, 
  User, 
  UserCog,
  Database 
} from 'lucide-react';

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Layout },
    { 
      name: 'Administration', 
      icon: Settings,
      children: [
        { name: 'Admin List', href: '/admins', icon: UserCog },
        { name: 'System Logs', href: '/system-logs', icon: Database },
      ]
    },
    { name: 'User Management', href: '/users', icon: Users },
    { 
      name: 'Content Management', 
      icon: BookOpen,
      children: [
        { name: 'Courses', href: '/courses', icon: Book },
        { name: 'Practice', href: '/practice', icon: Activity }
      ]
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary-600 text-white flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">LearnSys</span>
          </Link>
        </div>

        <div className="mt-5 px-4 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="space-y-1">
            {navigation.map((item) => 
              item.children ? (
                <div key={item.name} className="py-2">
                  <div className="flex items-center px-2 py-2 text-sm font-medium text-gray-600">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={`${
                          isActive(child.href)
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                      >
                        <child.icon className="mr-3 h-5 w-5" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;