import { FiVolume2, FiArrowRight, FiArrowLeft, FiRefreshCw, FiPlus, FiCheck } from 'react-icons/fi'

function FlashcardControls({ onPrev, onNext, onFlip, onKnown, onSave, isKnown, isSaved }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
      <button
        onClick={onPrev}
        className="p-3 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        title="Previous Card"
      >
        <FiArrowLeft className="h-5 w-5" />
      </button>
      
      <button
        onClick={onFlip}
        className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600"
        title="Flip Card"
      >
        <FiRefreshCw className="h-5 w-5" />
      </button>
      
      <button
        onClick={onKnown}
        className={`p-3 rounded-full ${
          isKnown
            ? 'bg-success-100 text-success-700 border border-success-300 hover:bg-success-200'
            : 'bg-success-500 text-white hover:bg-success-600'
        }`}
        title={isKnown ? "Mark as Unknown" : "Mark as Known"}
      >
        <FiCheck className="h-5 w-5" />
      </button>
      
      <button
        onClick={onNext}
        className="p-3 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        title="Next Card"
      >
        <FiArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default FlashcardControls