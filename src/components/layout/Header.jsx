import { Link } from 'react-router-dom'
import { FiMenu, FiUser, FiBell, FiSearch } from 'react-icons/fi'
import Logo from '../common/Logo'

function Header({ setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Logo className="h-14 w-auto" />
                {/* <span className="ml-2 text-xl font-semibold text-primary-600">FU.OHAYO</span> */}
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:flex">
            <div className="w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search for lessons, vocabulary..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button type="button" className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">View notifications</span>
              <FiBell className="h-6 w-6" aria-hidden="true" />
            </button>
            <Link to="/profile" className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">View profile</span>
              <FiUser className="h-6 w-6" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header