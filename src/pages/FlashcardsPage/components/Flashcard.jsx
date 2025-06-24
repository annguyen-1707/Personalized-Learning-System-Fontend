import { motion } from "framer-motion";
import { FiVolume2 } from "react-icons/fi";

function Flashcard({ card, flipped, setFlipped, isKnown, isSaved }) {
  const playAudio = (e) => {
    e.stopPropagation();
    speakText(card.kana, "ja-JP");
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

    const speakText = (text, lang = "ja-JP") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  return (
    <div
      className={`relative h-full w-full perspective-1000 cursor-pointer ${
        isKnown ? "opacity-60" : ""
      }`}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full preserve-3d"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT SIDE */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-white border-2 ${
            isSaved ? "border-accent-500" : "border-gray-200"
          } flex flex-col items-center justify-center p-6`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-2xl font-medium mb-2 text-gray-800">
            {card.kana}
          </div>
          <div className="text-4xl font-bold mb-2 text-primary-700">
            {card.kanji}
          </div>

          <button
            onClick={playAudio}
            className="mt-4 p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            <FiVolume2 className="h-6 w-6" />
          </button>

          <div
            className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 ${getJLPTBadgeColor(
              card.jlptLevel
            )}`}
          >
            {card.jlptLevel ? `JLPT ${card.jlptLevel}` : "N/A"}
          </div>

          {isKnown && (
            <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-success-100 text-success-600 rounded-full">
              Known
            </div>
          )}
        </div>

        {/* BACK SIDE */}
        <div
          className="absolute w-full h-full rounded-xl shadow-lg bg-white border border-gray-200 flex flex-col items-center justify-center p-6 space-y-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">
              Meaning
            </div>
            <div className="text-2xl font-semibold text-primary-700">
              {card.meaning || "No meaning provided"}
            </div>
          </div>
          <div className="w-12 border-t border-gray-200"></div>{" "}
          {/* Separator */}
          <div className="flex flex-col items-center text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">
              Pronunciation
            </div>
            <div className="text-xl font-medium text-gray-700">
              {card.romaji || "No pronunciation provided"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Flashcard;
