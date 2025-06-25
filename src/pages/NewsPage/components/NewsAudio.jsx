import React, { useState } from 'react';
import { FiPlay, FiPause, FiVolume2 } from 'react-icons/fi';

function NewsAudio({ audioFile }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  // Handle when audio doesn't exist
  if (!audioFile) {
    return null;
  }

  const togglePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="my-4 bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiVolume2 className="text-primary-500 mr-2 h-5 w-5" />
          <span className="font-medium">Listen to this article</span>
        </div>
        <button 
          onClick={togglePlay}
          className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition"
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
      </div>
      
      <audio 
        ref={el => setAudioElement(el)}
        src={audioFile}
        className="w-full mt-3"
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default NewsAudio;