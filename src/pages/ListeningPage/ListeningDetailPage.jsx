import { useParams } from "react-router-dom";
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeadphones, FiInfo } from 'react-icons/fi'
import AudioPlayer from './components/AudioPlayer'
import ListeningQuiz from './components/ListeningQuiz'

// Giả lập dữ liệu, thực tế bạn fetch từ backend theo id
const listeningExercises = {
  1: {
    id: 1,
    title: 'Daily Conversation Practice',
    description: 'Listen to a conversation between two friends making plans for the weekend.',
    level: 'N5',
    audioUrl: 'https://example.com/audio.mp3',
    transcript: [
      { startTime: 0, endTime: 5, japanese: 'こんにちは、週末は何をする予定ですか？', english: 'Hello, what are your plans for the weekend?' },
      { startTime: 5, endTime: 10, japanese: '映画を見に行こうと思っています。', english: "I'm thinking of going to see a movie." }
    ],
    questions: [
      {
        id: 1, startTime: 0, endTime: 5, text: 'What is the first person asking about?',
        options: ['Weekend plans', 'Movie preferences', 'Restaurant recommendations', 'Weather forecast'],
        correctAnswer: 'Weekend plans',
        explanation: 'The person asks "週末は何をする予定ですか？" which means "What are your plans for the weekend?"'
      },
      {
        id: 2, startTime: 5, endTime: 10, text: 'What does the second person plan to do?',
        options: ['Go shopping', 'Watch a movie', 'Visit friends', 'Study Japanese'],
        correctAnswer: 'Watch a movie',
        explanation: 'The person responds "映画を見に行こうと思っています" which means "I\'m thinking of going to see a movie."'
      }
    ]
  },
  2: {
    id: 2,
    title: 'Daily Conversation Practice',
    description: 'Listen to a conversation between two friends making plans for the weekend.',
    level: 'N5',
    audioUrl: 'https://example.com/audio.mp3',
    transcript: [
      { startTime: 0, endTime: 5, japanese: 'こんにちは、週末は何をする予定ですか？', english: 'Hello, what are your plans for the weekend?' },
      { startTime: 5, endTime: 10, japanese: '映画を見に行こうと思っています。', english: "I'm thinking of going to see a movie." }
    ],
    questions: [
      {
        id: 1, startTime: 0, endTime: 5, text: 'What is the first person asking about?',
        options: ['Weekend plans', 'Movie preferences', 'Restaurant recommendations', 'Weather forecast'],
        correctAnswer: 'Weekend plans',
        explanation: 'The person asks "週末は何をする予定ですか？" which means "What are your plans for the weekend?"'
      },
      {
        id: 2, startTime: 5, endTime: 10, text: 'What does the second person plan to do?',
        options: ['Go shopping', 'Watch a movie', 'Visit friends', 'Study Japanese'],
        correctAnswer: 'Watch a movie',
        explanation: 'The person responds "映画を見に行こうと思っています" which means "I\'m thinking of going to see a movie."'
      }
    ]
  },
  3: {
    id: 3,
    title: 'Daily Conversation Practice',
    description: 'Listen to a conversation between two friends making plans for the weekend.',
    level: 'N5',
    audioUrl: 'https://example.com/audio.mp3',
    transcript: [
      { startTime: 0, endTime: 5, japanese: 'こんにちは、週末は何をする予定ですか？', english: 'Hello, what are your plans for the weekend?' },
      { startTime: 5, endTime: 10, japanese: '映画を見に行こうと思っています。', english: "I'm thinking of going to see a movie." }
    ],
    questions: [
      {
        id: 1, startTime: 0, endTime: 5, text: 'What is the first person asking about?',
        options: ['Weekend plans', 'Movie preferences', 'Restaurant recommendations', 'Weather forecast'],
        correctAnswer: 'Weekend plans',
        explanation: 'The person asks "週末は何をする予定ですか？" which means "What are your plans for the weekend?"'
      },
      {
        id: 2, startTime: 5, endTime: 10, text: 'What does the second person plan to do?',
        options: ['Go shopping', 'Watch a movie', 'Visit friends', 'Study Japanese'],
        correctAnswer: 'Watch a movie',
        explanation: 'The person responds "映画を見に行こうと思っています" which means "I\'m thinking of going to see a movie."'
      }
    ]
  },
};

function ListeningDetailPage() {
  const { id } = useParams();
  const [currentTime, setCurrentTime] = useState(0);
  const exercise = listeningExercises[id];

  if (!exercise) return <div className="p-8">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
      >
        <div className="bg-primary-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{exercise.title}</h1>
              <p className="mt-2 opacity-90">{exercise.description}</p>
            </div>
            <div className="text-lg font-medium">
              JLPT {exercise.level}
            </div>
          </div>
        </div>
        <div className="p-6">
          <AudioPlayer
            audioUrl={exercise.audioUrl}
            onTimeUpdate={setCurrentTime}
          />
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transcript */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Transcript</h2>
            <div className="space-y-4">
              {exercise.transcript.map((line, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg transition-colors ${
                    currentTime >= line.startTime && currentTime <= line.endTime
                      ? 'bg-primary-50 border-2 border-primary-500'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-primary-600">{line.japanese}</div>
                  <div className="text-sm text-gray-600 mt-1">{line.english}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Tips */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Listening Tips</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start">
                <FiHeadphones className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                <span>Use headphones for better audio quality</span>
              </div>
              <div className="flex items-start">
                <FiInfo className="h-5 w-5 text-primary-500 mt-0.5 mr-2" />
                <span>Focus on understanding the main idea first</span>
              </div>
            </div>
          </div>
        </div>
        {/* Questions */}
        <div className="lg:col-span-2">
          <ListeningQuiz
            questions={exercise.questions}
            currentTime={currentTime}
          />
        </div>
      </div>
    </div>
  );
}

export default ListeningDetailPage;