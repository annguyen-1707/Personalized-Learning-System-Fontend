import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion'
import { FiMic, FiVolume2, FiBarChart2, FiMicOff, FiRepeat } from 'react-icons/fi'
import { getListDialogueByContentSpeakingId, assessPronunciation, getResultBeforeAssessFromAPI } from '../../services/ContentSpeakingClientService'


const SpeakingDetailPage = () => {
    const [feedback, setFeedback] = useState(null)
    const { contentSpeakingId } = useParams();
    const [listDialogue, setListDialogue] = useState([])
    const [dialogue, setDialogue] = useState(null);
    const [isRecording, setIsRecording] = useState(false)
    const [attempts, setAttempts] = useState(0)
    const mediaRecorderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioChunksRef = useRef([]);
    const [pronunciationResult, setPronunciationResult] = useState(null);

    useEffect(() => {
        getDialogueByContentSpeaking();
        setDialogue(listDialogue[currentIndex]);
        getResultBeforeAssess(listDialogue[currentIndex]?.dialogueId);
        const timeout = setTimeout(() => {
            playAudio(listDialogue[currentIndex]?.questionJp);
        }, 1200); // chờ 1.2 giây
        return () => clearTimeout(timeout);
    }, [currentIndex]);

    const getResultBeforeAssess = async (dialogueId) => {
        var response = await getResultBeforeAssessFromAPI(dialogueId);
        setPronunciationResult(response.data);
    }

    const getDialogueByContentSpeaking = async () => {
        // Fetch the list of dialogues for the given contentSpeakingId
        var response = await getListDialogueByContentSpeakingId(contentSpeakingId);
        console.log("Response from getListDialogueByContentSpeakingId:", response);
        if (response.data && response.data) {
            setListDialogue(response.data);
            if (dialogue === null) {
                setDialogue(response.data[0]); // Set the first dialogue as default
            }
        } else {
            console.error("No dialogues found for this content.");
        }
    }

    const playAudio = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // tiếng Nhật
        utterance.rate = 0.7; // tốc độ đọc
        speechSynthesis.speak(utterance);
    };

    const handleVoiceClick = async () => {
        if (!isRecording) {
            // 👉 Bắt đầu ghi âm
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm',
                    audioBitsPerSecond: 128000 // 128kbps
                });
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = event => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    const formData = new FormData();
                    formData.append("file", audioBlob, "voice-recording.webm");

                    try {
                        const response = await assessPronunciation(formData, dialogue.dialogueId);
                        if (response) {
                            console.log("Audio uploaded successfully: ", response);
                            setPronunciationResult(response.data);
                        } else {
                            console.error("Upload failed:", await response.text());
                        }
                    } catch (error) {
                        console.error("Error uploading audio:", error);
                    }
                };

                mediaRecorder.start();
                setIsRecording(true);
                console.log("Recording started...");
            } catch (err) {
                console.error("Microphone access denied or error:", err);
            }
        } else {
            // 👉 Dừng ghi âm
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setAttempts(prev => prev + 1)
            console.log("Recording stopped");
        }
    };

    const handleNextDialogue = () => {
        if (currentIndex < listDialogue.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setDialogue(listDialogue[currentIndex]);
            setPronunciationResult(null); // Reset result for new dialogue
        }
    };

    const handlePrevDialogue = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setDialogue(listDialogue[currentIndex]);
            setPronunciationResult(null); // Reset result for new dialogue
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 flex flex-row gap-6 items-start">
            {/* Main Content 2/3 */}
            <div className="w-2/3 space-y-2">
                <div className="flex items-center justify-between bg-primary-500 text-white p-6 rounded">
                    <div>
                        <h2 className="text-xl font-bold">Category: {dialogue?.contentSpeaking.category}</h2>
                        <p className="mt-2 opacity-90">{dialogue?.contentSpeaking.title}</p>
                    </div>
                    <span className="text-sm text-white">
                        Câu {currentIndex + 1}/{listDialogue.length}
                    </span>
                </div>

                <div className="p-6 border rounded bg-white shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-xl text-primary-600">Japanese: {dialogue?.questionJp}</div>
                            <div className="text-gray-600">Vietnamese: {dialogue?.questionVn}</div>
                        </div>
                        <button
                            onClick={() => { playAudio(dialogue?.questionJp) }}
                            className="p-2 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100"
                        >
                            <FiVolume2 className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="text-xl text-primary-600">Japanese: {dialogue?.answerJp}</div>
                    <div className="text-gray-600 mb-6">Vietnamese: {dialogue?.answerVn}</div>

                    <div className="flex flex-col items-center">
                        <button
                            onClick={handleVoiceClick}
                            className={`p-6 rounded-full ${isRecording ? 'bg-error-100 text-error-600 animate-pulse' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
                        >
                            {isRecording ? <FiMicOff className="h-8 w-8" /> : <FiMic className="h-8 w-8" />}
                        </button>
                        <div className="mt-2 text-sm text-gray-600">
                            {isRecording ? 'Recording... Click to stop' : 'Click to start speaking'}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">Attempts: {attempts}</div>
                    </div>

                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Speaking Tips</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start"><FiRepeat className="h-4 w-4 mt-1 mr-2 text-primary-500" />Listen to the example and try to mimic the intonation</li>
                            <li className="flex items-start"><FiRepeat className="h-4 w-4 mt-1 mr-2 text-primary-500" />Pay attention to the pitch accent of each word</li>
                            <li className="flex items-start"><FiRepeat className="h-4 w-4 mt-1 mr-2 text-primary-500" />Practice at a slower pace first, then increase speed</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePrevDialogue}
                        disabled={currentIndex === 0}
                        className={`px-4 py-2 rounded ${currentIndex === 0 ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
                    >← Prev</button>
                    <button
                        onClick={handleNextDialogue}
                        disabled={currentIndex === listDialogue.length - 1}
                        className={`px-4 py-2 rounded ${currentIndex === listDialogue.length - 1 ? 'bg-gray-300' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
                    >Next →</button>
                </div>
            </div>

            {/* Result Panel 1/3 */}
            <div className="w-1/3 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pronunciation Result</h3>
                {pronunciationResult ? (
                    <div className="space-y-4 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-4 justify-center mb-4">
                            {/* Pronunciation Score - Tổng điểm */}
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex flex-col items-center justify-center shadow-md border-4 border-primary-500">
                                <div className="text-xl font-bold text-primary-700">
                                    {Math.round(pronunciationResult.pronunciationScore)}%
                                </div>
                                <div className="text-xs text-primary-600 text-center">Overall</div>
                            </div>

                            {/* Các điểm thành phần */}
                            {[
                                { label: 'Accuracy', value: pronunciationResult.accuracyScore },
                                { label: 'Fluency', value: pronunciationResult.fluencyScore },
                                { label: 'Completeness', value: pronunciationResult.completenessScore },
                                { label: 'Prosody', value: pronunciationResult.prosodyScore },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="w-20 h-20 rounded-full bg-gray-100 flex flex-col items-center justify-center shadow-sm"
                                >
                                    <div className="text-md font-semibold text-gray-800">
                                        {Math.round(item.value)}%
                                    </div>
                                    <div className="text-[10px] text-gray-500 text-center px-1">
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recognized Text */}
                        <div className="mt-2">
                            <p className="font-medium text-gray-800 mb-2">Recognized Text:</p>
                            <p className="text-gray-600 text-sm bg-gray-50 px-3 py-2 rounded border">
                                {pronunciationResult.recognizedText}
                            </p>
                        </div>

                        {/* Advice */}
                        <div className="mt-3">
                            <p className="font-medium text-gray-800 mb-2">Advice & Suggestions:</p>
                            <ul className="list-disc ml-6 space-y-1 text-gray-600">
                                {pronunciationResult.advices?.length > 0 ? (
                                    pronunciationResult.advices.map((advice, index) => (
                                        <li key={index}>{advice}</li>
                                    ))
                                ) : (
                                    <li>No advice provided.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">No result yet. Record to see feedback.</p>
                )}
            </div>
        </div>
    );
};

export default SpeakingDetailPage;

