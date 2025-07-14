import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CourseCard from "./components/CourseCard";
import LearningPaggService from "../../services/LearningPaggService";
import ReactPaginate from "react-paginate";
import { useAuth } from "../../context/AuthContext";

function LearningPage() {
  const { getAllSubjectsById, getAllSubjects } = LearningPaggService;
  const [coursesData, setCoursesData] = useState([]);
  const [myCoursesData, setMyCoursesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState("all");
  const { user } = useAuth();

  const filteredCourses =
    selected === "my-courses" ? myCoursesData : coursesData;

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  const fetchCourses = async () => {
    const data = await getAllSubjectsById(currentPage);
    setMyCoursesData(data?.content);
    setTotalPages(data?.page?.totalPages);
    setCurrentPage(data?.page?.number);
  };

  const fetchAllCourses = async () => {
    try {
      const data = await getAllSubjects(currentPage);
      setCoursesData(data?.content);
      setTotalPages(data?.page?.totalPages);
      setCurrentPage(data?.page?.number);
    } catch (error) {
      console.error("Error fetching all courses:", error);
      setCoursesData([]);
      setTotalPages(0);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    if (!user || user === undefined) {
      fetchAllCourses();
    } else {
      fetchCourses();
      fetchAllCourses();
    }
  }, [user, currentPage]);

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

      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              selected === "all"
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300`}
            onClick={() => setSelected("all")}
          >
            Explore
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              selected === "my-courses"
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } border-t border-b border-r border-gray-300`}
            onClick={() => setSelected("my-courses")}
          >
            My learning
          </button>
        </div>
      </div>

      {/* Courses grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses?.map((course, index) => {
          const subject = selected === "my-courses" ? course?.subject : course;
          return (
            <motion.div
              key={course?.subjectId || course?.progressId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard
                subject={subject}
                progressStatus={course?.progressStatus}
                selected={selected}
              />
            </motion.div>
          );
        })}
      </div>
      {/* No courses message */}
      {filteredCourses?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No courses found.</p>
        </div>
      )}

      {filteredCourses?.length > 0 && (
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
      )}
    </div>
  );
}

export default LearningPage;
