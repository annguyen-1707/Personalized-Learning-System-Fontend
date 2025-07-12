import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import useReminderSocket from '../../hook/ReminderSocket'
import ReminderAlert from '../common/ReminderAlert'

function Layout({ onNotificationClick }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reminder, setReminder] = useState(null);
  const { user } = useAuth();
  useReminderSocket(user?.userId, setReminder);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <ReminderAlert reminder={reminder} onClose={() => setReminder(null)} />
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} onNotificationClick={onNotificationClick} />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6 md:px-6 md:py-8"
          >
            <Outlet />
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Layout