import axios from '../../services/customixe-axios';
import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

const FeedbackWidget = () => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (isAdminRoute) return null;

    const handleSubmit = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken || accessToken === "accessDenied") {
            alert("Please log in to submit feedback.");
            return;
        }

        if (!content || content.trim().length < 2 || rating === 0) {
            alert("Please enter content (at least 5 characters) and select a star rating.");
            return;
        }

        try {
            const res = await axios.post('api/public/postFeedback', {
                content: content.trim(),
                rating: rating
            });

            alert('Thank you for your feedback!');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data); // Hiện lỗi từ backend: "You can only post 3 feedbacks per day."
            } else {
                alert('Failed to submit feedback.');
            }
        }
        finally {
            setOpen(false);
            setContent('');
            setRating(0);
        }
    };

    return (
        <div>
            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-9 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50"
            >
                ✉️ Feedback
            </button>

            {/* Feedback popup */}
            {open && (
                <div className="fixed bottom-20 right-6 bg-white border shadow-xl rounded-lg p-4 w-80 z-50">
                    <h3 className="font-semibold mb-2">Submit Feedback</h3>

                    {/* Rating */}
                    <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-2xl transition ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="3"
                        className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Share your experience with us..."
                    />

                    {/* Submit button */}
                    <div className="text-right mt-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;
