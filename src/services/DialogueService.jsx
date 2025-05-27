import axios from "./customixe-axios";

const fetchDialogueByContentSpeakingId = (id) => {
    return axios.get(`/api/dialogue/content_speaking/${id}`);
}

const handleCreateDialogue = async (data) => {
    try {
        const response = await axios.post(`/api/dialogue`, data);
        alert("Tạo đoạn hội thoại thành công!");
        return response;
    } catch (error) {
        console.error(error);
        alert("Tạo đoạn hội thoại thất bại!");
    }
}

const handleDeleteDialogue = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa đoạn hội thoại này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/dialogue/${id}`);
        alert("Xoá đoạn hội thoại thành công!");
        return response;
    } catch (error) {
        console.error(error);
        alert("Xoá đoạn hội thoại thất bại!");
    }
}

const handleUpdateDialogue = async (id, data) => {
    try {
        const response = await axios.patch(`/api/dialogue/${id}`, data);
        alert("Cập nhật đoạn hội thoại thành công!");
        return response;
    } catch (error) {
        console.error(error);
        alert("Cập nhật đoạn hội thoại thất bại!");
    }
}

export {
    fetchDialogueByContentSpeakingId,
    handleCreateDialogue,
    handleDeleteDialogue,
    handleUpdateDialogue
};

