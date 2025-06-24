import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiVolume2, FiArrowRight, FiArrowLeft, FiDownload, FiPlus, FiCheck, FiRefreshCw } from 'react-icons/fi'
import Flashcard from '../FlashcardsPage/components/Flashcard'
import FlashcardStats from '../FlashcardsPage/components/FlashcardStats'
import FlashcardControls from '../FlashcardsPage/components/FlashcardControls'

function FlashcardsPage({ words }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState([])


  
  // Filter cards based on the selected deck
  const currentCards = words || []
  const currentCard = currentCards[currentCardIndex]
  console.log('Current Card:', currentCard)
  
  const nextCard = () => {
    setFlipped(false)
    setTimeout(() => {
      if (currentCardIndex < currentCards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
      } else {
        // Loop back to the first card if we're at the end
        setCurrentCardIndex(0)
      }
    }, 200)
  }
  
  const prevCard = () => {
    setFlipped(false)
    setTimeout(() => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1)
      } else {
        // Loop to the last card if we're at the beginning
        setCurrentCardIndex(currentCards.length - 1)
      }
    }, 200)
  }
  
  const toggleCardKnown = () => {
    const cardId = currentCard.id
    if (knownCards.includes(cardId)) {
      setKnownCards(knownCards.filter(id => id !== cardId))
    } else {
      setKnownCards([...knownCards, cardId])
    }
    nextCard()
  }
  return (
    <div className="max-w-4xl mx-auto">    
      {/* Flashcard container */}
      <div className="mb-8 flex flex-col items-center">
        {currentCards.length > 0 ? (
          <>
            <div className="w-full max-w-md h-64 mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCardIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Flashcard
                    card={currentCard}
                    flipped={flipped}
                    setFlipped={setFlipped}
                    isKnown={knownCards.includes(currentCard.id)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            
            <FlashcardStats
              currentIndex={currentCardIndex}
              totalCards={currentCards.length}
              knownCards={knownCards.length}
            />
            
            <FlashcardControls
              onPrev={prevCard}
              onNext={nextCard}
              onFlip={() => setFlipped(!flipped)}
              onKnown={toggleCardKnown}
              flipped={flipped}
              isKnown={knownCards.includes(currentCard.id)}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No flashcards available for this deck.</p>
          </div>
        )}
      </div>
      
      {/* Additional options */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="flex justify-center">
          <button className="btn btn-secondary flex items-center justify-center">
            <FiDownload className="mr-2" />
            Download Source
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlashcardsPage