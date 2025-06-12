import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { CourseContentService } from "../../../services/CourseContentService";
import { ArrowRight } from "lucide-react";

const PAGE_SIZE = 5;

function LessonExercises({ lessonId }) {
  const [exercises, setExercises] = useState([]);
  const { getExercisesByLessonId } = CourseContentService;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesData = await getExercisesByLessonId(lessonId);
        setExercises(exercisesData.data.content || []);
        setCurrentPage(0);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, [lessonId]);

  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg italic">
          Không có bài tập nào cho bài học này.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(exercises.length / PAGE_SIZE);
  const paginatedExercises = exercises.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercises</h2>

      <div className="space-y-4">
        {paginatedExercises.map((ex, idx) => (
          <div
            key={ex.id || idx}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary-600 mb-1">
                  {ex.title || `Bài tập ${currentPage * PAGE_SIZE + idx + 1}`}
                </h3>
                <p className="text-gray-700 text-sm">{ex.description}</p>
                {ex.duration && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    ⏱ Thời gian làm bài: {ex.duration} phút
                  </p>
                )}
              </div>

              <Link
                to={`/exercises/${ex.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Làm bài
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ReactPaginate
          breakLabel="..."
          nextLabel="→"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={totalPages}
          previousLabel="←"
          containerClassName="flex items-center gap-2 text-sm"
          pageClassName="block"
          pageLinkClassName="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-blue-100 transition"
          previousLinkClassName="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
          nextLinkClassName="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
          breakLinkClassName="px-2 py-1 text-gray-500"
          activeLinkClassName="bg-blue-600 text-white border-blue-600"
        />
      </div>
    </div>
  );
}

export default LessonExercises;
