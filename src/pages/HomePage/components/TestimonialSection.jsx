import { useEffect, useState } from 'react';

function TestimonialSection() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchFeedbacks = async (page = 0, rating = null) => {
    const queryParams = new URLSearchParams({
      page: page,
      size: 6,
    });

    if (rating !== null) queryParams.append("rating", rating);

    try {
      const res = await fetch(`http://localhost:8080/public/get-feedback?${queryParams}`);
      const data = await res.json();
      setFeedbacks(data.content || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleShowMore = () => {
    setShowMore(true);
    fetchFeedbacks(0, selectedRating);
  };

  const handleFilter = (rating) => {
    setSelectedRating(rating);
    fetchFeedbacks(0, rating);
  };

  const handleReset = () => {
    setShowMore(false);
    setSelectedRating(null);
    fetchFeedbacks();
  };

  const handlePageChange = (page) => {
    fetchFeedbacks(page, selectedRating);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const formatGender = (gender) => {
    if (gender === "MALE") return "Male";
    if (gender === "FEMALE") return "Female";
    return "Other";
  };

  const visibleFeedbacks = showMore ? feedbacks : feedbacks.slice(0, 3);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-gray-900">What Our Users Say</h2>
          <p className="text-lg text-gray-500 mt-2">
            Real feedback from our valued learners and parents
          </p>
        </div>                  

        {/* Filter by rating */}
        {showMore && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleFilter(star)}
                className={`px-3 py-1 border rounded ${selectedRating === star ? 'bg-yellow-400 text-white' : 'bg-gray-100'}`}
              >
                {star} star{star > 1 ? 's' : ''}
              </button>
            ))}
            <button
              onClick={handleReset}
              className="px-3 py-1 border rounded bg-blue-500 text-white"
            >
              All
            </button>
          </div>
        )}

        {/* Feedback cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visibleFeedbacks.map((fb, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <p className="text-yellow-500 font-semibold">⭐ {fb.rating} star{fb.rating > 1 ? 's' : ''}</p>
              <p className="mt-2 text-gray-700">{fb.content}</p>
              <p className="mt-2 text-sm text-gray-900 font-medium">
                {fb.user?.fullName || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500">
                {fb.user?.gender === "MALE" ? "Male" : fb.user?.gender === "FEMALE" ? "Female" : "Other"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on: {formatDate(fb.createdAt)}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {showMore && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`px-3 py-1 border rounded ${index === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* View more / Hide */}
        <div className="text-center mt-6">
          {!showMore ? (
            <button
              onClick={handleShowMore}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              View more
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Hide
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
