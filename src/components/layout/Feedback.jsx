import React, { useState } from 'react';

const FeedbackWidget = () => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async () => {
        if (!content || rating === 0) {
            alert("Vui lòng nhập nội dung và chọn số sao.");
            return;
        }

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, rating })
            });

            if (res.ok) {
                alert('Cảm ơn bạn đã phản hồi!');
                setContent('');
                setRating(0);
                setOpen(false);
            } else {
                alert('Có lỗi xảy ra.');
            }
        } catch (error) {
            alert('Không gửi được phản hồi.');
        }
    };

    return (
        <div>
            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50"
            >
                ✉️ Góp ý
            </button>

            {/* Feedback popup */}
            {open && (
                <div className="fixed bottom-20 right-6 bg-white border shadow-xl rounded-lg p-4 w-80 z-50">
                    <h3 className="font-semibold mb-2">Gửi phản hồi</h3>

                    {/* Rating */}
                    <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-2xl transition ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    {/* Nội dung */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="3"
                        className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                    />

                    {/* Nút gửi */}
                    <div className="text-right mt-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;