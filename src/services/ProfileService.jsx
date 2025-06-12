import axios from "./customixe-axios";
import uploadFile from "./UploadFileService";
import { toast } from "react-toastify";

const getLearningProgressFromAPI = () => {
    var res = axios.get(`/api/profile/overview/learning_progress`);
    return res;
}

const getProgressVocabularyFromAPI = () => {
    var res = axios.get(`/api/profile/progress/vocabulary`);
    return res;
}

const getProgressGrammarFromAPI = () => {
    var res = axios.get(`/api/profile/progress/grammar`);
    return res;
}

const getProgressExerciseFromAPI = () => {
    var res = axios.get(`/api/profile/progress/exercise`);
    return res;
}
const getStudentInfoFromAPI = () => {
    var res = axios.get(`/api/profile/information`);
    return res;
}

const handleAvatarUploadFromAPI = async (data) => {
    try {
        const imageUrl = await uploadFile(data, "images/avatar");
        const response = await axios.patch(`/api/profile/updateAvatar?avatar=${imageUrl}`);
        return response;
    } catch (error) {
        console.error("Error appending file to formData:", error);
    }
}

const getStudyReminderFromAPI = async () => {
    return axios.get(`/api/study-reminder`);
}

const handleCreateStudyReminderFromAPI = async (data) => {
    try {
        const response = await axios.post(`/api/study-reminder`, data);
        toast.success("Tạo lời nhắc thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Tạo lời nhắc thất bại!");
    }
}

const handleUpdateStudyReminderFromAPI = async (id, data) => {
    try {
        const response = await axios.patch(`/api/study-reminder/${id}`, data);
        toast.success("Cập nhật lời nhắc thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Cập nhật lời nhắc thất bại!");
    }
}

const handleDeleteStudyReminderFromAPI = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa lời nhắc này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/study-reminder/${id}`);
        toast.success("xóa lời nhắc thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("xóa lời nhắc thất bại!");
    }
}

export {
    getLearningProgressFromAPI, getProgressVocabularyFromAPI, getProgressGrammarFromAPI, getProgressExerciseFromAPI, getStudentInfoFromAPI, handleAvatarUploadFromAPI,
    getStudyReminderFromAPI, handleCreateStudyReminderFromAPI, handleDeleteStudyReminderFromAPI, handleUpdateStudyReminderFromAPI
}