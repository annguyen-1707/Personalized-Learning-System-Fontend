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

const getQuestionPageByContentListeningId = async (page, id, size) => {
    return axios.get(`/api/question/content_listening/${id}?page=${page}&size=${size}`);
}

const getQuestionPageFromAPI = async(page, size) => {
    return axios.get(`/api/question?page=${page}&size=${size}`);
}

const acceptQuestion = async(id) => {
    console.log("id", id)
    return axios.patch(`/api/question/${id}/accept`)
}

const rejectQuestion = async(id) => {
    return axios.patch(`/api/question/${id}/reject`)
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

export {
    getQuestionPageByContentListeningId,
    handleCreateQuestion,
    handleDeleteQuestion,
    handleUpdateQuestion,
    handleCreateManyQuestion,
    getQuestionPageFromAPI,
    acceptQuestion,
    rejectQuestion,
    getLessonBySubjectIdFromAPI,
    getListAllSubjectFromAPI,
    getExerciseByLessonIdFromAPI,
    getContentListeningByLeverFromAPI,
}

