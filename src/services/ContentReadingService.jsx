import axios from "./customixe-axios";
import uploadFile from './UploadFileService';
import { toast } from "react-toastify";
const fetchAllContentReading = () => {
    return axios.get(`/api/content_reading`)
}

const fetchAllContentCategoryReading = () => {
    return axios.get(`/api/content_category/reading`)
}

const handleCreateContent = async (data) => {
    try {
        // 1. Upload ảnh trước
        const imageUrl = await uploadFile(data.image, "images/content_reading");
        const audio = await uploadFile(data.audioFile, "audio/content_reading");
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
            scriptJp: data.scriptJp,
            scriptVn: data.scriptVn,
            audioFile: audio,
            timeNew: data.timeNew
        };
        console.log("data", data)
        const response = await axios.post(`/api/content_reading`, formData, "images/content_reading");
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "can not create");
    }
};


async function handleDeleteContent(id) {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa nội dung này không?');
    if (!confirmDelete) return;
    try {
        const response = await axios.delete(`/api/content_reading/${id}`);
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
        let audio = data.audioFile;
        if (data.image instanceof File) {
            imageUrl = await uploadFile(data.image, "images/content_reading");
        }
        if (data.audioFile instanceof File) {
            audio = await uploadFile(data.audioFile, "audio/content_reading");

        }
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
            scriptJp: data.scriptJp,
            scriptVn: data.scriptVn,
            audioFile: audio,
            timeNew: data.timeNew
        };
        const response = await axios.patch(`/api/content_reading/${id}`, formData);
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "Can not update ");
    }
}

const getPageContentReading = async (page, size) => {
    return axios.get(`/api/content_reading?page=${page}&size=${size}`)
}

export { getPageContentReading, handleUpdateContent, fetchAllContentReading, fetchAllContentCategoryReading, handleCreateContent, handleDeleteContent }