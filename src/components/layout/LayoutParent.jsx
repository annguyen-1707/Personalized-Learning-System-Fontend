import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { motion } from 'framer-motion'

function LayoutParent() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />

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

export default LayoutParent