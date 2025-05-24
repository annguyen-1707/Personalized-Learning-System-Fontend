import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
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
  Database,
  Newspaper,
  Mic,
  Headphones,
  ChevronDown,
} from "lucide-react";

function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Layout },
    {
      name: "Administration",
      icon: Settings,
      children: [
        { name: "Admin List", href: "/admins", icon: UserCog },
        { name: "System Logs", href: "/system-logs", icon: Database },
      ],
    },
    { name: "User Management", href: "/users", icon: Users },
    {
      name: "Content Management",
      icon: BookOpen,
      children: [
        { name: "Learning", href: "/learning", icon: Book },
        {
          name: "Practice",
          icon: Activity,
          children: [
            { name: "Listening", href: "/listening", icon: Headphones },
            { name: "Speaking", href: "/speaking", icon: Mic },
            { name: "Reading", href: "/reading", icon: Newspaper },
          ],
        },
      ],
    },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Dropdown component for sub-children (Practice)
  function Dropdown({ subChildren, isActive }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ml-auto relative">
      <button onClick={() => setOpen(!open)} className="p-2 focus:outline-none">
        <ChevronDown className="h-5 w-5" />
      </button>
      {open && (
        <div className=" absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {subChildren.map((subChild) => (
            <Link
              key={subChild.name}
              to={subChild.href}
              className={`block px-4 py-2 text-sm ${
                isActive(subChild.href)
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <subChild.icon className="inline mr-2 h-5 w-5" />
              {subChild.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
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

        {/* content managementent */}
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
                      <div key={child.name} className="flex items-center">
                        <Link
                          to={child.href}
                          className={`${
                            isActive(child.href)
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-600 hover:bg-gray-50"
                          } group flex items-center px-2 py-2 text-sm font-medium rounded-md flex-1`}
                        >
                          <child.icon className="mr-3 h-5 w-5" />
                          {child.name}
                        </Link>
                        {child.children && (
                          <Dropdown subChildren={child.children} isActive={isActive} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
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
