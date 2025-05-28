import axios from "./customixe-axios";
import uploadFile from './UploadFileService';
import { toast } from "react-toastify";
// const [errorMessage, setErrorMessage] = useState('');


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
        const response = await axios.post(`/api/content_speaking`, formData);
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "Chọn chủ đề");
    }
};


async function handleDeleteContent(id) {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa nội dung này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/content_speaking/${id}`);
        toast.success("Xoá content thành công!");
        return response;
    } catch (error) {
        console.error(error);
        toast.error("Xoá content thất bại!");
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
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "Can not create ");
    }
}

const getPageContentSpeaking = async (page, size) => {
    return axios.get(`/api/content_speaking?page=${page}&size=${size}`)
}

export { getPageContentSpeaking, handleUpdateContent, fetchAllContentSpeaking, fetchAllContentCategorySpeaking, handleCreateContent, handleDeleteContent }