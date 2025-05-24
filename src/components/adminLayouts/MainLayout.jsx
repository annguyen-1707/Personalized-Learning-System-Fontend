import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X, ChevronRight } from 'lucide-react';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs = paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      let label = path.charAt(0).toUpperCase() + path.slice(1);
      
      // Replace IDs with more readable labels if needed
      if (path.match(/^[0-9a-fA-F]{8,}$/)) {
        const prevPath = paths[index - 1];
        if (prevPath === 'courses') {
          label = 'Course Details';
        } else if (prevPath === 'lessons') {
          label = 'Lesson Details';
        } else if (prevPath === 'admins') {
          label = 'Admin Details';
        }
      }
      
      return { label, url };
    });
    
    return [{ label: 'Dashboard', url: '/dashboard' }, ...breadcrumbs];
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={`lg:pl-64 transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="p-2 text-gray-500 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="flex items-center ml-auto">
              <div className="ml-3 relative">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    A
                  </div>
                  <span className="hidden md:block text-sm font-medium">Admin User</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 sm:px-6 lg:px-8 py-2 text-sm">
            <nav className="flex">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.url} className="flex items-center">
                  {index > 0 && <ChevronRight size={16} className="mx-1 text-gray-400" />}
                  <Link 
                    to={crumb.url} 
                    className={`${
                      index === breadcrumbs.length - 1
                        ? 'text-gray-700 font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;