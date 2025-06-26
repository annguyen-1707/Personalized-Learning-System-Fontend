import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeadphones, FiInfo } from 'react-icons/fi';
import axios from "axios";
import ListeningQuiz from "./components/ListeningQuiz";
import AudioPlayer from "./components/AudioPlayer";

function ListeningDetailPage() {
  const { contentListeningId } = useParams();
  const [exercise, setExercise] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!contentListeningId) {
      setError("Invalid listening ID.");
      setLoading(false);
      return;
    }
    const fetchDetailAndQuestions = async () => {
      try {
        // Fetch listening detail
        const res = await axios.get(`http://localhost:8080/content_listening/details/${contentListeningId}`);
        console.log("Content listening details response:", res.data);
        setExercise(res.data.data);
        // Fetch questions for this listening (page=0 for first page)
        const qRes = await axios.get(`http://localhost:8080/question/content_listening/${contentListeningId}?page=1&size=5`);
        let questionsArr = [];
        if (qRes.data?.data?.content && Array.isArray(qRes.data.data.content)) {
          questionsArr = qRes.data.data.content;
        } else if (Array.isArray(qRes.data?.data)) {
          questionsArr = qRes.data.data;
        } else if (Array.isArray(qRes.data)) {
          questionsArr = qRes.data;
        }
        setQuestions(questionsArr);
      } catch (err) {
        setError("Cannot load listening detail or questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetailAndQuestions();
  }, [contentListeningId]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!exercise) return <div className="p-8">Not found</div>;

  // Add this before rendering the AudioPlayer
  console.log("Audio file value:", exercise.audioFile);
  console.log("Constructed audio URL:", exercise.audioFile.startsWith("http")
    ? exercise.audioFile
    : `http://localhost:8080/audio/content_listening/${exercise.audioFile}`);

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
              <h1 className="text-2xl font-bold">{exercise?.title || "No title"}</h1>
            </div>
            <div className="text-lg font-medium">
              {exercise?.category || ""}
            </div>
          </div>
        </div>
        <div className="p-6">
          {exercise?.audioFile ? (
            <AudioPlayer
              audioUrl={
                exercise.audioFile.startsWith("http")
                  ? exercise.audioFile 
                  : exercise.audioFile.startsWith("data:") 
                    ? exercise.audioFile // Handle data URLs
                    : `http://localhost:8080/audio/content_listening/${exercise.audioFile}`
              }
              onTimeUpdate={(time) => setCurrentTime(time)}
            />
          ) : (
            <div className="text-gray-400">No audio available</div>
          )}
        </div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transcript */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Transcript</h2>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-gray-50">
                <div className="text-primary-600">{exercise?.scriptJp || "No Japanese script"}</div>
                <div className="text-sm text-gray-600 mt-1">{exercise?.scriptVn || "No Vietnamese script"}</div>
              </div>
            </div>
          </div>
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
          {questions.length > 0 ? (
            <ListeningQuiz
             questions={questions}
              currentTime={currentTime}
               contentId={contentListeningId} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-400">No questions available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListeningDetailPage;