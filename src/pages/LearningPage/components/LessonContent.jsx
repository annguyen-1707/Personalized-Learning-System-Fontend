import { motion } from "framer-motion";
import { FiVolume2, FiDownload } from "react-icons/fi";

function LessonContent({ lesson }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose max-w-none"
    >
      <h2>Lesson Content</h2>

      {lesson.introduction && (
        <div className="mb-8">
          <h3>Introduction</h3>
          <p>{lesson.introduction}</p>
        </div>
      )}

      {lesson.dialogs && lesson.dialogs.length > 0 && (
        <div className="mb-8">
          <h3>Dialogue</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {lesson.dialogs.map((dialog, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center">
                  <span className="font-bold mr-2">{dialog.speaker}:</span>
                  <span className="text-primary-600">{dialog.japanese}</span>
                  <button className="ml-2 text-gray-500 hover:text-primary-500">
                    <FiVolume2 />
                  </button>
                </div>
                <div className="ml-8 text-gray-600">{dialog.english}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.content && (
        <div className="mb-8">
          <h3>Main Content</h3>
          <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
        </div>
      )}

      {lesson.examples && lesson.examples.length > 0 && (
        <div className="mb-8">
          <h3>Examples</h3>
          <div className="space-y-4">
            {lesson.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-primary-600 font-medium">
                    {example.japanese}
                  </span>
                  <button className="ml-2 text-gray-500 hover:text-primary-500">
                    <FiVolume2 />
                  </button>
                </div>
                <div className="text-gray-600 mt-1">{example.english}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.culturalNotes && (
        <div className="mb-8">
          <h3>Cultural Notes</h3>
          <div className="bg-accent-50 p-4 rounded-lg border-l-4 border-accent-500">
            <p>{lesson.culturalNotes}</p>
          </div>
        </div>
      )}

      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mb-8">
          <h3>Additional Resources</h3>
          <ul className="space-y-2">
            {lesson.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.url}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiDownload className="mr-2" />
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

export default LessonContent;
