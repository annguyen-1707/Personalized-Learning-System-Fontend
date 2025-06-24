import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink } from 'react-router-dom'
import {
  FiX, FiHome, FiBook, FiFileText, FiLayers, FiHelpCircle,
  FiActivity, FiMessageCircle, FiGlobe, FiHeadphones, FiMic,
  FiType, FiCreditCard, FiStar
} from 'react-icons/fi'
import { FiBookOpen } from 'react-icons/fi'

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigation = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Learn', href: '/learning', icon: FiBook },
    { name: 'Favorite', href: '/favorites/vocabulary', icon: FiFileText },
    // { name: 'AI Conversation', href: '/ai-conversation', icon: FiMessageCircle },
    { name: 'Quiz', href: '/quiz', icon: FiHelpCircle },
    { name: 'News', href: '/news', icon: FiGlobe },
    { name: 'Listening', href: '/listening', icon: FiHeadphones },
    { name: 'Speaking', href: '/speaking', icon: FiMic },
    { name: 'Name Translation', href: '/name-translation', icon: FiType },
    { name: 'Upgrade', href: '/upgrade', icon: FiStar },
  ]

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <FiX className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <FiBookOpen className="h-8 w-auto  text-primary-600" />
                  <span className="ml-2 text-xl font-semibold text-primary-600">FU.OHAYO</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className="mr-4 h-6 w-6 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <NavLink to="/upgrade" className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <FiCreditCard className="inline-block h-10 w-10 rounded-full text-accent-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                        Upgrade to Premium
                      </p>
                      <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                        Unlock all features
                      </p>
                    </div>
                  </div>
                </NavLink>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <FiBookOpen className="h-8 w-auto text-primary-600" />
                <span className="ml-2 text-xl font-semibold text-primary-600">FU.OHAYO</span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <NavLink to="/upgrade" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <FiCreditCard className="inline-block h-9 w-9 rounded-full text-accent-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Upgrade to Premium
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      Unlock all features
                    </p>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar