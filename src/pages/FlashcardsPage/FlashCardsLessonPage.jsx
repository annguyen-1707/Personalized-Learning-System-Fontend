import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiVolume2,
  FiArrowRight,
  FiArrowLeft,
  FiRefreshCw,
  FiPlus,
  FiCheck,
  FiDownload,
} from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "../../services/customixe-axios";

// Flashcard Component
function Flashcard({ card, flipped, setFlipped, isKnown, isSaved, playAudio }) {
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
    <div
      className={`relative h-full w-full perspective-1000 cursor-pointer ${
        isKnown ? "opacity-60" : ""
      }`}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* Front */}
        <div
          className="absolute w-full h-full rounded-xl shadow-lg bg-white border-2  border-gray-200
           flex flex-col items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-4xl font-bold mb-2 text-primary-700">
            {card.kanji}
          </div>
          {card?.kana && (
            <div className="text-base italic text-gray-600 mb-2">
              {card.kana}
            </div>
          )}
          {card?.romaji && (
            <div className="text-lg text-gray-600 mb-4">{card.romaji}</div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playAudio(card.kana);
            }}
            className="mt-2 p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            <FiVolume2 className="h-6 w-6" />
          </button>
          <div
            className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 ${getJLPTBadgeColor(
              card.jlptLevel
            )} rounded-full`}
          >
            JLPT: {card.jlptLevel}
          </div>
          {card.partOfSpeech && (
            <div className="absolute bottom-2 right-2 text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              {card.partOfSpeech}
            </div>
          )}
          {isKnown && (
            <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-success-100 text-success-600 rounded-full">
              Known
            </div>
          )}
        </div>

        {/* Back */}
        <div
          className="relative w-full h-full rounded-2xl shadow-xl bg-white border border-gray-200 p-6 flex flex-col justify-between transition-transform duration-500"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* JLPT Badge */}
          <div
            className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 ${getJLPTBadgeColor(
              card.jlptLevel
            )} rounded-full`}
          >
            JLPT: {card.jlptLevel}
          </div>

          {/* Known Badge */}
          {isKnown && (
            <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-success-100 text-success-600 rounded-full">
              Known
            </div>
          )}

          {/* Main content */}
          <div className="mt-12">
            {" "}
            {/* create space below badges */}
            {/* Meaning */}
            <div className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {card.meaning}
            </div>
            {/* Example */}
            {card.example && (
              <div className="space-y-2">
                <div className="flex justify-center items-center gap-2 text-sm font-semibold text-gray-600">
                  Example:
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(card.example);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition"
                    aria-label="Phát âm ví dụ"
                  >
                    <FiVolume2 className="h-6 w-6" />
                  </button>
                </div>
                <div className="text-lg italic text-gray-800 text-center">
                  {card.example}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Controls Component
function FlashcardControls({
  onPrev,
  onNext,
  onFlip,
  onKnown,
  onSave,
  flipped,
  isKnown,
  isSaved,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
      <button
        onClick={onPrev}
        className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
        title="Previous"
      >
        <FiArrowLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onFlip}
        className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600"
        title="Flip"
      >
        <FiRefreshCw className="h-5 w-5" />
      </button>
      <button
        onClick={onKnown}
        className={`p-3 rounded-full ${
          isKnown
            ? "bg-success-100 text-success-700 border-success-300"
            : "bg-success-500 text-white"
        } hover:bg-success-200`}
        title={isKnown ? "Mark Unknown" : "Mark Known"}
      >
        <FiCheck className={`h-5 w-5 ${isKnown ? "opacity-50" : ""}`} />
      </button>
      <button
        onClick={onNext}
        className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
        title="Next"
      >
        <FiArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

// Stats Component
function FlashcardStats({ currentIndex, totalCards, knownCards }) {
  const percent = totalCards ? Math.round((knownCards / totalCards) * 100) : 0;
  return (
    <div className="flex justify-between items-center w-full max-w-md mb-6">
      <div className="text-center">
        <div className="text-xl font-bold text-primary-600">
          {currentIndex + 1}
        </div>
        <div className="text-sm text-gray-600">Current</div>
      </div>
      <div className="w-16 h-16">
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          styles={buildStyles({
            textSize: "1.5rem",
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-primary-600">{totalCards}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-success-500">{knownCards}</div>
        <div className="text-sm text-gray-600">Known</div>
      </div>
    </div>
  );
}

// Main Page Component
export default function FlashcardsPage(words = []) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const current = words?.words[idx] || {};

  const playAudio = (text, lang = "ja-JP") => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  const next = () => {
    setFlipped(false);
    setIdx((i) => (i < words?.words?.length - 1 ? i + 1 : 0));
  };

  const prev = () => {
    setFlipped(false);
    setIdx((i) => (i > 0 ? i - 1 : words?.words?.length - 1));
  };

  const getKnownWords = async () => {
    try {
      const response = await axios.get(
        `/api/progress-vocabularies/known?lessonId=${words?.lessonId}`
      );
      setKnown(response.data.map((item) => item.vocabularyId));
    } catch (error) {
      console.error("Failed to fetch known words", error);
    }
  };

  useEffect(() => {
    getKnownWords();
  }, []);

  // Khi Mark Known, gọi API cập nhật progress của lesson
  const toggleKnown = async () => {
    const id = current?.vocabularyId;
    const isMastered = known.includes(Number(current?.vocabularyId));
    try {
      await axios.patch(`/api/progress-vocabularies/${id}/complete`, {
        status: isMastered ? "IN_PROGRESS" : "MASTERED",
      });
      await getKnownWords();
      if (!isMastered) next();
    } catch (err) {
      setKnown((k) => (isMastered ? [...k, id] : k.filter((x) => x !== id)));
      console.error("Failed to update progress", err);
    }
  };

  const handleDownloadDeck = () => {
    if (!words || words.length === 0) return;
    const json = JSON.stringify(words, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `flashcards-lesson.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <section className="flex flex-col items-center mb-8">
          <div className="w-full max-w-md h-64 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Flashcard
                  card={current}
                  flipped={flipped}
                  setFlipped={setFlipped}
                  isKnown={known.includes(Number(current?.vocabularyId))}
                  playAudio={playAudio}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <FlashcardStats
            currentIndex={idx}
            totalCards={words?.words?.length}
            knownCards={words?.words?.length === 0 ? 0 : known.length}
          />
          <FlashcardControls
            onPrev={prev}
            onNext={next}
            onFlip={() => setFlipped((f) => !f)}
            onKnown={toggleKnown}
            flipped={flipped}
            isKnown={known.includes(current.id)}
          />
        </section>
      </div>

      <footer className="w-full bg-white shadow p-6 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center">
            <button
              onClick={handleDownloadDeck}
              className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              <FiDownload className="mr-2" /> Download Deck
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
