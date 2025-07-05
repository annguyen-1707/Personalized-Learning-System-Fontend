import axios from "./customixe-axios";
import { toast } from "react-toastify";

const fetchDialogueAllByContentSpeakingId = (id) => {
    return axios.get(`/api/dialogue/content_speakingAll/${id}`);
}

const fetchDialoguePage = (page, size) => {
    return axios.get(`/api/dialogue/page/all?page=${page}&size=${size}`);
}

const handleCreateDialogue = async (data) => {
    try {
        const response = await axios.post(`/api/dialogue`, data);
        return response;
    } catch (error) {
        let allErrors = error.response?.data?.data?.map(e => e.message).join(", ");
        if (!allErrors) {
            allErrors = error?.response?.data?.message || "Failed to update content";
        } 
        console.error("All error", allErrors)
        throw new Error(allErrors);
    }
}

const handleDeleteDialogue = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa đoạn hội thoại này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/dialogue/${id}`);
        toast.success("Xoá đoạn hội thoại thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Xoá đoạn hội thoại thất bại!");
    }
}

const handleUpdateDialogue = async (id, data) => {
    try {
        const response = await axios.patch(`/api/dialogue/${id}`, data);
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "Failed to create dialogue");
    }
}

const getDialoguePageByContentSpeakingId = async (page, id, size) => {
    return axios.get(`/api/dialogue/content_speaking/${id}?page=${page}&size=${size}`);
}

export {
    fetchDialogueAllByContentSpeakingId,
    getDialoguePageByContentSpeakingId,
    handleCreateDialogue,
    handleDeleteDialogue,
    handleUpdateDialogue,
    fetchDialoguePage
};

