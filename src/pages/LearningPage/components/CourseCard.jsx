import { FiBook } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";
import { useState } from "react";
import LearningPaggService from "../../../services/LearningPaggService";

function CourseCard({ subject, selected, progressStatus }) {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const { enrollInCourse } = LearningPaggService;

  const handleStartLearning = async (e) => {
    e.preventDefault();
    if (selected === "all") {
      setShowEnrollDialog(true);
    } else {
      console.log("Selected course:", subject?.subjectId);
      await enrollInCourse(subject?.subjectId);
      window.location.href = `/learning/${subject?.subjectId}`;
    }
  };

  const handleConfirmEnroll = async () => {
    await enrollInCourse(subject?.subjectId);
    setShowEnrollDialog(false);
    window.location.href = `/learning/${subject?.subjectId}`;
  };

  const renderCardContent = () => (
    <>
      <div className="relative">
        <img
          src={"http://localhost:8080/images/content_learning/" + subject?.thumbnailUrl || "https://via.placeholder.com/300x200"}
          alt={subject?.subjectName}
          className="w-full h-48 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity duration-300"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-300">
            {subject?.subjectCode}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {subject?.subjectName}
        </h3>
        <p className="mt-2 text-gray-600 line-clamp-2">{subject?.description}</p>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <FiBook className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{subject?.countLessons} Lessons</span>

          <span className="mx-2">•</span>

          <MdPeopleAlt className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
          <span>{subject?.countUsers}</span>
          {progressStatus && (
            <>
              <span className="mx-2">•</span>
              <span
                className={`text-sm font-medium ${
                  progressStatus === "IN_PROGRESS"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {progressStatus === "IN_PROGRESS"
                  ? "In Progress..."
                  : "Completed"}
              </span>
            </>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleStartLearning}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"`}
          >
            {selected === "all"
              ? "Start Learning"
              : progressStatus === "IN_PROGRESS"
              ? "Resume Learning"
              : "Review"}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="card h-full overflow-hidden card-hover">
      {renderCardContent()}

      {/* Enrollment Confirmation Dialog chỉ hiện khi ở tab all */}
      {selected === "all" && showEnrollDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enroll in Course</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to enroll in {subject?.subjectName}? This
              will give you access to all course materials and lessons.
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
  );
}

export default CourseCard;
