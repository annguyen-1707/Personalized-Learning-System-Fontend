import { motion } from "framer-motion";
import { FiVolume2, FiDownload } from "react-icons/fi";

function LessonContent({ lesson }) {
  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
        <p className="mt-4 text-gray-600">
          The lesson you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose max-w-none"
    >
      <h2>Lesson Content</h2>

      {/* Description */}
      {lesson.description && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Description</h3>
          <p>{lesson.description}</p>
        </div>
      )}

      {/* Video or Thumbnail */}
      <div className="mb-6">
        {lesson.videoUrl ? (
          <div className="aspect-video">
            <iframe
              src={lesson.videoUrl}
              title="Lesson Video"
              className="w-full h-full rounded-lg border"
              allowFullScreen
            ></iframe>
          </div>
        ) : lesson.thumbnailUrl ? (
          <div>
            <img
              src={lesson.thumbnailUrl}
              alt="Lesson Thumbnail"
              className="w-full max-w-2xl rounded-lg border"
            />
          </div>
        ) : null}
      </div>

      {/* Introduction */}
      {lesson.name && (
        <div className="mb-8">
          <h3>Introduction</h3>
          <p>{lesson.name}</p>
        </div>
      )}
    </motion.div>
  );
}

export default LessonContent;
