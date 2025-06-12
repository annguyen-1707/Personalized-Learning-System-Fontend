import { useState } from "react";
import { motion } from "framer-motion";
import { FiVolume2, FiPlus, FiCheck } from "react-icons/fi";

function LessonVocabulary({ lesson }) {
  const [savedWords, setSavedWords] = useState([]);

  const toggleSaveWord = (wordId) => {
    if (savedWords.includes(wordId)) {
      setSavedWords(savedWords.filter((id) => id !== wordId));
    } else {
      setSavedWords([...savedWords, wordId]);
    }
  };

  const speakText = (text, lang = "ja-JP") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Trình duyệt của bạn không hỗ trợ phát âm.");
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vocabulary</h2>
      </div>

      {lesson.vocabularies && lesson.vocabularies.length > 0 ? (
        <div className="space-y-4">
          {lesson.vocabularies.map((word, index) => (
            <motion.div
              key={word.vocabularyId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                {/* Left block */}
                <div className="flex-1">
                  {/* Word + Audio */}
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-primary-600 mr-3">
                      {word.kanji}
                    </h3>
                    <button
                      className="p-1 hover:bg-gray-100 rounded-full"
                      onClick={() => speakText(word.kana)}
                    >
                      <FiVolume2 className="text-gray-500" />
                    </button>
                  </div>

                  {/* Kana & Romaji */}
                  <div className="text-sm text-gray-500 mb-1">
                    {word.kana} ・ {word.romaji}
                  </div>

                  {/* Meaning */}
                  <div className="text-gray-800 font-medium">
                    {word.meaning}
                  </div>

                  {/* Example sentence */}
                  {word.example && (
                    <div className="mt-3 text-sm">
                      <p className="text-primary-600 mb-1">
                        例文: {word.example}
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {word.notes && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Note:</span> {word.notes}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {word.partOfSpeech && (
                      <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                        {word.partOfSpeech}
                      </span>
                    )}
                    {word.jlptLevel && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getJLPTBadgeColor(
                          word.jlptLevel
                        )}`}
                      >
                        JLPT {word.jlptLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Save/Unsave Button */}
                <button
                  onClick={() => toggleSaveWord(word.vocabularyId)}
                  className={`p-2 rounded-full ${
                    savedWords.includes(word.vocabularyId)
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {savedWords.includes(word.vocabularyId) ? (
                    <FiCheck className="h-5 w-5" />
                  ) : (
                    <FiPlus className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No vocabulary items available for this lesson.
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default LessonVocabulary;
