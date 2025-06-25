import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function FlashcardStats({ currentIndex, totalCards, knownCards }) {
  const progress = (knownCards / totalCards) * 100
  
  return (
    <div className="flex justify-between items-center w-full max-w-md mb-6">
      <div className="text-center">
        <div className="text-xl font-bold text-primary-600">{currentIndex + 1}</div>
        <div className="text-sm text-gray-600">Current</div>
      </div>
      
      <div className="w-16 h-16">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            textSize: '1.5rem',
            pathTransitionDuration: 0.5,
            pathColor: '#3E64FF',
            textColor: '#3E64FF',
            trailColor: '#E0E7FF',
          })}
        />
      </div>
      
      <div className="text-center">
        <div className="text-xl font-bold text-primary-600">{totalCards}</div>
        <div className="text-sm text-gray-600">Total Cards</div>
      </div>
      
      <div className="text-center">
        <div className="text-xl font-bold text-success-500">{knownCards}</div>
        <div className="text-sm text-gray-600">Known</div>
      </div>
    </div>
  )
}

export default FlashcardStats