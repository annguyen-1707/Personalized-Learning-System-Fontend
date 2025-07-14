import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookmark, FiVolume2, FiChevronDown } from "react-icons/fi";
import FlashCardsLessonPage from "../../FlashcardsPage/GrammarFlashCards";

function LessonGrammar({ lesson }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const speakJapanese = (text) => {
    if ("speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getJLPTBadgeColor = (level) => {
    switch (level) {
      case "N5":
        return "bg-green-100 text-green-800";
      case "N4":
        return "bg-yellow-100 text-yellow-800";
      case "N3":
        return "bg-blue-100 text-blue-800";
      case "N2":
        return "bg-purple-100 text-purple-800";
      case "N1":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Grammar Points</h2>
      <div className="mb-4">
        <FlashCardsLessonPage
          words={lesson.grammars}
          lessonId={lesson?.lessonId}
        />
      </div>

      {lesson.grammars && lesson.grammars.length > 0 ? (
        <div className="space-y-4">
          {lesson.grammars.map((grammarPoint, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              {/* Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full p-4 flex justify-between items-center bg-primary-50 hover:bg-primary-100 transition"
              >
                <div className="text-left">
                  <h3 className="text-xl font-medium text-primary-800">
                    {grammarPoint.titleJp}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    JLPT Level:
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${getJLPTBadgeColor(
                        grammarPoint.jlptLevel
                      )}`}
                    >
                      {grammarPoint.jlptLevel || "N/A"}
                    </span>
                  </div>
                </div>
                <FiChevronDown
                  className={`h-5 w-5 text-primary-600 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Content */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 space-y-4"
                  >
                    <div>
                      <div className="font-medium text-gray-800">Pattern:</div>
                      <div className="mt-1 text-primary-600 text-lg">
                        {grammarPoint.structure}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-800">Usage:</div>
                      <div className="mt-1 text-gray-700">
                        {grammarPoint.usage}
                      </div>
                    </div>

                    {grammarPoint.example && (
                      <div className="mb-4">
                        <div className="font-medium text-gray-800 mb-2">
                          Example:
                        </div>
                        <div className="bg-gray-50 p-3 rounded flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-primary-600">
                              {grammarPoint.example}
                            </span>
                            <button
                              onClick={() =>
                                speakJapanese(grammarPoint.example)
                              }
                              className="text-gray-500 hover:text-primary-500"
                            >
                              <FiVolume2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {grammarPoint.notes && (
                      <div>
                        <div className="font-medium text-gray-800">Notes:</div>
                        <div className="mt-1 text-gray-700">
                          {grammarPoint.notes}
                        </div>
                      </div>
                    )}

                    {grammarPoint.relatedGrammar &&
                      grammarPoint.relatedGrammar.length > 0 && (
                        <div>
                          <div className="font-medium text-gray-800">
                            Related Grammar:
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {grammarPoint.relatedGrammar.map((item, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-primary-600 rounded text-sm"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No grammar points available for this lesson.
        </div>
      )}
    </motion.div>
  );
}

export default LessonGrammar;
