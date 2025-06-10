import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CourseCard from "./components/CourseCard";
import LearningPaggService from "../../services/LearningPaggService";
import ReactPaginate from "react-paginate";
function LearningPage() {
  const { getAllSubjects } = LearningPaggService;
  const [coursesData, setCoursesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const fetchCourses = async () => {
    const data = await getAllSubjects(currentPage);
    setCoursesData(data.content);
    setTotalPages(data.page.totalPages);
    setCurrentPage(data.page.number);
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Japanese Courses
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
          Choose a course to start learning Japanese
        </p>
      </motion.div>

      {/* Courses grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {coursesData.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard course={course} />
          </motion.div>
        ))}
      </div>

      <ReactPaginate
        className="pagination mt-6 justify-center"
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3} // giới hạn trang bên trái 1 2 3 .... 99 100
        marginPagesDisplayed={2} // giới hạn trang bên phải 1 2 3 .... 99 100
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />

      {/* No courses message */}
      {coursesData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found.</p>
        </div>
      )}

      {/* Need help section */}
      {/* <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Not sure where to start?
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Take our placement test to find the perfect course for your level
        </p>
        <Link
          to="/placement-test"
          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
        >
          Take Placement Test
        </Link>
      </div> */}
    </div>
  );
}

export default LearningPage;
