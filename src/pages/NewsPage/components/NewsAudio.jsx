import { useState, useRef, useEffect } from 'react'
import { FiPlay, FiPause, FiRepeat, FiVolume2, FiSkipBack, FiSkipForward } from 'react-icons/fi'

function NewsAudio({ audioUrl, onTimeUpdate }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [error, setError] = useState(false)
  const audioRef = useRef(null)
  
  useEffect(() => {
    setError(false);
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
    onTimeUpdate(audioRef.current.currentTime)
  }
  
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration)
  }
  
  const handleSeek = (e) => {
    const time = e.target.value
    audioRef.current.currentTime = time
    setCurrentTime(time)
    onTimeUpdate(time)
  }
  
  const handleVolumeChange = (e) => {
    const value = e.target.value
    setVolume(value)
    audioRef.current.volume = value
  }
  
  const skipBackward = () => {
    const newTime = Math.max(0, currentTime - 5)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
    onTimeUpdate(newTime)
  }
  
  const skipForward = () => {
    const newTime = Math.min(duration, currentTime + 5)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
    onTimeUpdate(newTime)
  }
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio error:", e);
          setError(true);
        }}
      >
        <source src={audioUrl} type="audio/mpeg" />
        <source src={audioUrl} type="audio/mp3" />
        <source src={audioUrl} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
      
      {error ? (
        <div className="text-red-500 mb-4">
          Error loading audio. The file might not exist or format is not supported.
          <div className="text-sm mt-1">URL: {audioUrl}</div>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={skipBackward}
                className="p-2 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100"
              >
                <FiSkipBack className="h-5 w-5" />
              </button>
              
              <button
                onClick={togglePlay}
                className="p-4 bg-primary-500 text-white rounded-full hover:bg-primary-600"
              >
                {isPlaying ? (
                  <FiPause className="h-6 w-6" />
                ) : (
                  <FiPlay className="h-6 w-6" />
                )}
              </button>
              
              <button
                onClick={skipForward}
                className="p-2 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100"
              >
                <FiSkipForward className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <FiVolume2 className="h-5 w-5 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default NewsAudio