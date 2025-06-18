import axios from "./customixe-axios";
import { uploadFile } from './UploadFileService';
import { toast } from "react-toastify";
const fetchAllContentListening = () => {
    return axios.get(`/api/content_listening`)
}

const fetchAllContentCategoryListening = () => {
    return axios.get(`/api/content/category/listening`)
}

const handleCreateContent = async (data) => {
    if (data.image === null || data.image === "") {
        throw new Error("upload image before create");
    }
    if (data.audioFile === null || data.audioFile === "") {
        throw new Error("upload audioFile before create");
    }
    if (data.category === "") {
        throw new Error("choose category")
    }
    if (data.status === "") {
        throw new Error("choose status")
    }
    if (data.jlptLevel === "") {
        throw new Error("choose jlptLevel")
    }
    try {
        if (data.image === null || data.image === "") {
            throw new Error("upload image before create");
        }
        if (data.audioFile === null || data.audioFile === "") {
            throw new Error("upload audioFile before create");
        }
        if (data.category === "") {
            throw new Error("choose category")
        }
        // 1. Upload ảnh trước
        const imageUrl = await uploadFile(data.image, "images/content_listening");
        const audio = await uploadFile(data.audioFile, "audio/content_listening");
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
            scriptJp: data.scriptJp,
            scriptVn: data.scriptVn,
            audioFile: audio,
            status: data.status,
            jlptLevel: data.jlptLevel
        };
        console.log("data", data)
        const response = await axios.post(`/api/content_listening`, formData);
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
        const response = await axios.delete(`/api/content_listening/${id}`);
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
            imageUrl = await uploadFile(data.image, "images/content_listening");
        }
        if (data.audioFile instanceof File) {
            audio = await uploadFile(data.audioFile, "audio/content_listening");

        }
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
            scriptJp: data.scriptJp,
            scriptVn: data.scriptVn,
            audioFile: audio,
        };
        const response = await axios.patch(`/api/content_listening/${id}`, formData);
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "Can not update ");
    }
}

const getPageContentListening = async (page, size) => {
    return axios.get(`/api/content_listening?page=${page}&size=${size}`)
}

const getStatus = () => {
    return axios.get(`/api/content/status`)
}

const getJlptLevel = () => {
    return axios.get(`/api/vocabularies/levels`)
}

export {
    getPageContentListening, handleUpdateContent, fetchAllContentListening, fetchAllContentCategoryListening,
    handleCreateContent, handleDeleteContent, getStatus, getJlptLevel
}