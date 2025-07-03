import { Link } from 'react-router-dom'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link to="/about" className="text-gray-500 hover:text-gray-600">
            About
          </Link>
          <Link to="/privacy" className="text-gray-500 hover:text-gray-600">
            Privacy
          </Link>
          <Link to="/terms" className="text-gray-500 hover:text-gray-600">
            Terms
          </Link>
          <Link to="/contact" className="text-gray-500 hover:text-gray-600">
            Contact
          </Link>
        </div>
        <div className="mt-4 md:mt-0 md:order-1">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} FU.OHAYO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer