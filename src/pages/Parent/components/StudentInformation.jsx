import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiShield, FiActivity } from 'react-icons/fi'
import { getStudentInfoFromAPI } from '../../../services/ParentService'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function StudentInformation({ studentId }) {
  const [studentInfo, setStudentInfo] = useState(null)

  useEffect(() => {
    getStudentInformation()
  }, [])

  const getStudentInformation = async () => {
    const res = await getStudentInfoFromAPI(studentId)
    if (res && res.data) {
      setStudentInfo(res.data)
      console.log("Student Info:", res.data)
    }
  }

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-lg font-medium text-gray-900 mb-6">Student Information</h2>

      {!studentInfo ? (
        <p className="text-gray-500 text-center">No student data available</p>
      ) : (
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center">
            <FiUser className="mr-3 text-primary-600" />
            <span><strong>Full Name:</strong> {studentInfo.fullName}</span>
          </div>
          <div className="flex items-center">
            <FiMail className="mr-3 text-primary-600" />
            <span><strong>Email:</strong> {studentInfo.email}</span>
          </div>
          <div className="flex items-center">
            <FiPhone className="mr-3 text-primary-600" />
            <span><strong>Phone:</strong> {studentInfo.phone}</span>
          </div>
          <div className="flex items-center">
            <FiUser className="mr-3 text-primary-600" />
            <span><strong>Gender:</strong> {studentInfo.gender}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="mr-3 text-primary-600" />
            <span><strong>Address:</strong> {studentInfo.address}</span>
          </div>
          <div className="flex items-center">
            <FiAward className="mr-3 text-primary-600" />
            <span><strong>Membership Level:</strong> {studentInfo.membershipLevel}</span>
          </div>
          <div className="flex items-center">
            <FiActivity className="mr-3 text-primary-600" />
            <span><strong>Status:</strong> {studentInfo.status}</span>
          </div>
          <div className="flex items-center">
            <FiShield className="mr-3 text-primary-600" />
            <span><strong>Role:</strong> {studentInfo.roleName}</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default StudentInformation

