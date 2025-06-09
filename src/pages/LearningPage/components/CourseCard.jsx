import { Link } from 'react-router-dom'
import { FiClock, FiBook, FiBarChart2 } from 'react-icons/fi'
import { MdPeopleAlt } from "react-icons/md";
import { useState } from 'react';
import LearningPaggService from "../../../services/LearningPaggService";

function CourseCard({ course }) {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const { enrollInCourse } = LearningPaggService;

  const handleStartLearning = (e) => {
    e.preventDefault();
    setShowEnrollDialog(true);
  };

  const handleConfirmEnroll = async () => {
    await enrollInCourse(course.subjectId);
    setShowEnrollDialog(false);
    window.location.href = `/learning/${course.subjectId}/lesson-1`;
  };

  return (
    <div className="card h-full overflow-hidden card-hover">
      <div className="relative">
        <img 
          src={'https://via.placeholder.com/300x200'} 
          alt={course.subjectName} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-300`}>
            {course.subjectCode}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{course.subjectName}</h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{course.description}</p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <FiBook className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{course.countLessons} Lessons</span>
          
          <span className="mx-2">•</span>

          <MdPeopleAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{course.countUsers}</span>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleStartLearning}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
          >
            Start Learning
          </button>
        </div>
      </div>

      {/* Enrollment Confirmation Dialog */}
      {showEnrollDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enroll in Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to enroll in {course.subjectName}? This will give you access to all course materials and lessons.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEnrollDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnroll}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseCard