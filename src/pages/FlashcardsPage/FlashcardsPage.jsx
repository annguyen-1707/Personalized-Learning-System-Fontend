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
import axios from "axios";
import { useSearchParams } from "react-router-dom";

// Flashcard Component
function Flashcard({ card, flipped, setFlipped, isKnown, isSaved, playAudio }) {
  return (
    <div
      className={`relative h-full w-full perspective-1000 cursor-pointer ${isKnown ? "opacity-60" : ""
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
          className={`absolute w-full h-full rounded-xl shadow-lg bg-white border-2 ${isSaved ? "border-accent-500" : "border-gray-200"
            } flex flex-col items-center justify-center p-6`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-4xl font-bold mb-2 text-primary-700">
            {card.frontText}
          </div>
          {card.romaji && (
            <div className="text-base italic text-gray-600 mb-2">
              {card.romaji}
            </div>
          )}
          {card.subText && (
            <div className="text-lg text-gray-600 mb-4">{card.subText}</div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playAudio(card.frontText);
            }}
            className="mt-2 p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
          >
            <FiVolume2 className="h-6 w-6" />
          </button>
          <div className="absolute top-2 right-2 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
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
          className={`absolute w-full h-full rounded-xl shadow-lg bg-white border-2 ${isSaved ? "border-accent-500" : "border-gray-200"
            } flex flex-col items-start justify-start p-6`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-2xl font-medium mb-2 text-gray-800">
            {card.translation}
          </div>
          {card.notes && (
            <div className="mt-2 text-sm p-2 bg-gray-50 rounded text-gray-600 w-full">
              <span className="font-medium">Notes:</span> {card.notes}
            </div>
          )}
          {card.example && (
            <div className="mt-4 text-sm w-full">
              <div className="font-medium">Example:</div>
              <div className="italic text-gray-700">
                {card.example.japanese}
              </div>
              <div className="text-gray-600">{card.example.english}</div>
            </div>
          )}
          <div className="absolute top-2 right-2 text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            JLPT: {card.jlptLevel}
          </div>
          {isKnown && (
            <div className="absolute top-2 left-2 text-xs font-medium px-2 py-1 bg-success-100 text-success-600 rounded-full">
              Known
            </div>
          )}
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
        className={`p-3 rounded-full ${isKnown
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
export default function FlashcardsPage(words) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "vocabulary";
  const favoriteListId = searchParams.get("favoriteListId");
  const [inProgress, setInProgress] = useState([]);
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [saved, setSaved] = useState([]);

  const playAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.speak(utterance);
  };

  const markInProgressIfNotTouched = async (cardId) => {
    // Chỉ gọi API nếu flashcard chưa từng học (không thuộc known hoặc inProgress)
    if (!known.includes(cardId) && !inProgress.includes(cardId)) {
      try {
        await axios.patch("http://localhost:8080/flashcards/status", null, {
          params: {
            type,
            favoriteListId,
            flashcardId: cardId,
            status: "IN_PROGRESS",
          },
        });
        setInProgress((prev) => [...prev, cardId]); // cập nhật state sau khi gọi API
      } catch (err) {
        console.error("Failed to mark IN_PROGRESS", err);
      }
    }
  };

  useEffect(() => {
    if (!favoriteListId) return;
    axios
      .get("http://localhost:8080/flashcards", {
        params: { type, favoriteListId },
      })
      .then((res) => {
        const data = res.data.data || [];
        setCards(data);
        setIdx(0);
        setFlipped(false);
        setKnown(
          data
            .filter((card) => card.status === "MASTERED")
            .map((card) => card.id)
        );
        setInProgress(
          data
            .filter((card) => card.status === "IN_PROGRESS")
            .map((card) => card.id)
        );
        setSaved([]); // nếu có saved thì xử lý sau
      })
      .catch(console.error);
  }, [type, favoriteListId]);

  const current = cards[idx] || {};
  const next = async () => {
    if (current && current.id) {
      await markInProgressIfNotTouched(current.id);
    }
    setFlipped(false);
    setIdx((i) => (i < cards.length - 1 ? i + 1 : 0));
  };

  const prev = async () => {
    if (current && current.id) {
      await markInProgressIfNotTouched(current.id);
    }
    setFlipped(false);
    setIdx((i) => (i > 0 ? i - 1 : cards.length - 1));
  };

  const toggleKnown = async () => {
    const id = current.id;
    const isMastered = known.includes(id);
    const newStatus = isMastered ? "IN_PROGRESS" : "MASTERED";

    setKnown((k) => (isMastered ? k.filter((x) => x !== id) : [...k, id]));

    try {
      await axios.patch("http://localhost:8080/flashcards/status", null, {
        params: { type, favoriteListId, flashcardId: id, status: newStatus },
      });

      // 👉 Chỉ chuyển sang thẻ tiếp theo nếu là mới đánh dấu MASTERED
      if (!isMastered) {
        next();
      }
    } catch (err) {
      setKnown((k) => (isMastered ? [...k, id] : k.filter((x) => x !== id)));
      console.error("Failed to toggle status", err);
    }
  };

  const toggleSaved = () => {
    const id = current.id;
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const handleDownloadDeck = () => {
    if (!cards || cards.length === 0) return;
    const json = JSON.stringify(cards, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `flashcards-${type}.json`;
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
                  isKnown={known.includes(current.id)}
                  isSaved={saved.includes(current.id)}
                  playAudio={playAudio}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          
          <FlashcardStats
            currentIndex={idx}
            totalCards={cards.length}
            knownCards={known.length}
          />
          
          <FlashcardControls
            onPrev={prev}
            onNext={next}
            onFlip={() => setFlipped((f) => !f)}
            onKnown={toggleKnown}
            onSave={toggleSaved}
            flipped={flipped}
            isKnown={known.includes(current.id)}
            isSaved={saved.includes(current.id)}
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
