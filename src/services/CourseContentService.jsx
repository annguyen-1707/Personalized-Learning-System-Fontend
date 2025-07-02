import axios from "axios";

const getCourseContentById = async (courseId) => {
  try {
    const response = await axios.get(`/api/subjects/${courseId}`,{
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching course content:", error);
    throw new Error("Failed to fetch course content");
  }
};

const getProgressCourseBySubjectId = async (subjectId) => {
  try {
    const response = await axios.get(
      `/api/progress-subjects?subjectId=${subjectId}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
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
      `/api/course-lessons?subjectId=${subjectId}`, 
      // {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   }
      // });
    )
      console.log("Response from getLessonsBySubjectId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching lessons by subject ID:", error);
    throw new Error("Failed to fetch lessons");
  }
};

const getProgressByLessonId = async (lessonId) => {
  try {
    const response = await axios.get(
      `/api/progress-lessons?lessonId=${lessonId}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching progress by lesson ID:", error);
    throw new Error("Failed to fetch lesson progress");
  }
};

const getExercisesByLessonId = async (lessonId) => {
  try {
    const response = await axios.get(
      `/api/exercise-questions?lessonId=${lessonId}`, {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises by lesson ID:", error);
    throw new Error("Failed to fetch exercises");
  }
};

const handleStartLesson = async (lessonId) => {
  try {
    const response = await axios.post(
      `/api/progress-lessons?lessonId=${lessonId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error starting lesson:", error);
    throw new Error("Failed to start lesson");
  }
};

const markCourseComplete = async (subjectId) => {
  try {
    const response = await axios.patch(
      `/api/progress-subjects/complete?subjectId=${subjectId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking course complete:", error);
    throw new Error("Failed to mark course complete");
  }
}

export const CourseContentService = {
  getCourseContentById,
  getProgressCourseBySubjectId,
  getLessonsBySubjectId,
  getProgressByLessonId,
  getExercisesByLessonId,
  handleStartLesson,
  markCourseComplete
};

export default CourseContentService;
