import axios from "./customixe-axios";
import uploadFile from './UploadFileService';


const fetchAllContentSpeaking = () => {
    return axios.get(`/api/content_speaking`)
}

const fetchAllContentCategorySpeaking = () => {
    return axios.get(`/api/content_category/speaking`)
}

const handleCreateContent = async (data) => {
    try {
        // 1. Upload ảnh trước
        const imageUrl = await uploadFile(data.image);
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
        };
        const response = axios.post(`/api/content_speaking`, formData);
        alert("Tạo content thành công!");
        return response;
    } catch (error) {
        console.error(error);
        alert("Tạo content thất bại!");
    }
}

const handleDeleteConrent = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa nội dung này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/content_speaking/${id}`);
        alert("Xoá content thành công!");
        return response;
    } catch (error) {
        console.error(error);
        alert("Xoá content thất bại!");
    }
}

const handleUpdateContent = async (id, data) => {
    try {
        // 1. Upload ảnh trước nếu có
        let imageUrl = data.image;
        if (data.image instanceof File) {
            imageUrl = await uploadFile(data.image);
        }
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
        };
        const response = await axios.patch(`/api/content_speaking/${id}`, formData);
        alert("Cập nhật content thành công!");
        return response;
    } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Cập nhật content thất bại!");
    }
}


export { handleUpdateContent, fetchAllContentSpeaking, fetchAllContentCategorySpeaking, handleCreateContent, handleDeleteConrent }