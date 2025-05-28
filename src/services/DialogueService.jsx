import axios from "./customixe-axios";
import { toast } from "react-toastify";

const fetchDialogueAllByContentSpeakingId = (id) => {
    return axios.get(`/api/dialogue/content_speakingAll/${id}`);
}

const handleCreateDialogue = async (data) => {
    try {
        const response = await axios.post(`/api/dialogue`, data);
        toast.success("Tạo đoạn hội thoại thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Tạo đoạn hội thoại thất bại!");
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
        toast.success("Cập nhật đoạn hội thoại thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Cập nhật đoạn hội thoại thất bại!");
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
    handleUpdateDialogue
};

