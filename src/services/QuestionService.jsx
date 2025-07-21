import axios from "./customixe-axios";
import { toast } from "react-toastify";

const handleCreateQuestion = async (data) => {
    try {
        console.log("data before create:", data);
        const response = await axios.post(`/api/question`, data);
        return response;
    } catch (error) {
        console.error("Error creating question:", error.response?.data);
        var allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        if (!allErrors) {
            allErrors = error.response?.data?.message;
        }
        throw new Error(allErrors || "Can not create question");
    }
}

const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa đoạn câu hỏi này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/question/${id}`);
        toast.success("Xoá đoạn câu hỏi thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Xoá đoạn câu hỏi thất bại!");
    }
}

const handleCreateManyQuestion = async (data) => {
    try {
        const response = await axios.post(`/api/question/many`, data);
        toast.success("Tạo đoạn câu hỏi thành công!");
        return response;
    } catch (error) {
        console.error("Error creating question:", error.response?.data);
        var allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        if (!allErrors) {
            allErrors = error.response?.data?.message;
        }
        throw new Error(allErrors || "Can not create question");
    }
}

const handleUpdateQuestion = async (id, data) => {
    try {
        const response = await axios.patch(`/api/question/${id}`, data);
        return response;
    } catch (error) {
        console.error("Error creating question:", error.response?.data);
        var allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        if (!allErrors) {
            allErrors = error.response?.data?.message;
        }
        throw new Error(allErrors || "Can not create question");
    }
}

const getQuestionByContentListeningId = async (id) => {
    return axios.get(`/api/question/content_listening/${id}`);
}

const getQuestionByExerciseId = async (id) => {
    return axios.get(`/api/question/exercise/${id}`);
}

const getQuestionPageFromAPI = async(page, size, activeType) => {
    return axios.get(`/api/question/type?page=${page}&size=${size}&type=${activeType}`);
}

const getListAllSubjectFromAPI = async() => {
    return axios.get(`/api/subjects/getListAllSubject`)
}

const getLessonBySubjectIdFromAPI = async(subjectId) => {
    return axios.get(`/api/lessons?size=999999&subjectId=${subjectId}`);
}

const getExerciseByLessonIdFromAPI = async(lessonId) => {
    return axios.get(`/api/exercise-questions?lessonId=${lessonId}&size=999999`)
}

const getContentListeningByLeverFromAPI = async(jlptLevel) => {
    return axios.get(`/api/content_listening/jlptLevel?jlptLevel=${jlptLevel}`)
}

const addQuestionToContentListening = async(contentListeningId, questionId) => {
    console.log("Adding question to content listening:", contentListeningId, questionId);
    return axios.patch(`/api/question/${questionId}/addContentListening/${contentListeningId}`);
}

const removeQuestionFromContentListening = async(questionId) => {
    return axios.patch(`/api/question/${questionId}/removeFromContentListening`);
}

const addQuestionToExercise = async(exerciseId, questionId) => {
    return axios.patch(`/api/question/${questionId}/addExercise/${exerciseId}`);
}

const removeQuestionFromExercise = async(questionId) => {
    return axios.patch(`/api/question/${questionId}/removeFromExercise`);
}

const getQuestionEmpty = (type, page, size) => {
    return axios.get(`/api/question/empty?type=${type}`);
}

export {
    getQuestionByContentListeningId,
    handleCreateQuestion,
    handleDeleteQuestion,
    handleUpdateQuestion,
    handleCreateManyQuestion,
    getQuestionPageFromAPI,
    getLessonBySubjectIdFromAPI,
    getListAllSubjectFromAPI,
    getExerciseByLessonIdFromAPI,
    getContentListeningByLeverFromAPI,
    addQuestionToContentListening,
    removeQuestionFromContentListening,
    addQuestionToExercise,
    removeQuestionFromExercise,
    getQuestionEmpty,
    getQuestionByExerciseId
}

