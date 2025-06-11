import axios from "axios";

const getCourseContentById = async (courseId) => {
  try {
    const response = await axios.get(`/api/subjects/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course content:", error);
    throw new Error("Failed to fetch course content");
  }
};

const getProgressCourseBySubjectId = async (subjectId) => {
  try {
    const userId = 1;
    const response = await axios.get(
      `/api/progress-subjects?userId=${userId}&subjectId=${subjectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course progress:", error);
    throw new Error("Failed to fetch course progress");
  }
};

const getLessonsBySubjectId = async (subjectId) => {
  try {
    const response = await axios.get(
      `/api/course-lessons?subjectId=${subjectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lessons by subject ID:", error);
    throw new Error("Failed to fetch lessons");
  }
};

const getProgressByLessonId = async (lessonId) => {
  try {
    const userId = 1;
    const response = await axios.get(
      `/api/progress-lessons?userId=${userId}&lessonId=${lessonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching progress by lesson ID:", error);
    throw new Error("Failed to fetch lesson progress");
  }
};

const getExercisesByLessonId = async (lessonId) => {
  try {
    const response = await axios.get(
      `/api/exercise-questions?lessonId=${lessonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises by lesson ID:", error);
    throw new Error("Failed to fetch exercises");
  }
};
export const CourseContentService = {
  getCourseContentById,
  getProgressCourseBySubjectId,
  getLessonsBySubjectId,
  getProgressByLessonId,
  getExercisesByLessonId,
};

export default CourseContentService;
