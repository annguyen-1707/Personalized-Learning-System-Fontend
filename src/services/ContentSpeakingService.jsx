import axios from "./customixe-axios";
import { uploadFile } from './UploadFileService';
import { toast } from "react-toastify";
// const [errorMessage, setErrorMessage] = useState('');


const fetchAllContentSpeaking = () => {
    return axios.get(`/api/content_speaking`)
}

const fetchAllContentCategorySpeaking = () => {
    return axios.get(`/api/content/category/speaking`)
}

const handleCreateContent = async (data) => {
    console.log("data before create:", data)
    if (data.image === null || data.image === "") {
        throw new Error("upload image before create");
    }
    if (data.category === "") {
        throw new Error("choose category")
    }
    try {
        // 1. Upload ảnh trước
        const imageUrl = await uploadFile(data.image, "images/content_speaking");
        // 2. Gửi dữ liệu content kèm URL ảnh
        const formData = {
            title: data.title,
            image: imageUrl,
            category: data.category,
            status: data.status,
            jlptLevel: data.jlptLevel
        };
        const response = await axios.post(`/api/content_speaking`, formData);
        return response;
    } catch (error) {
        const allErrors = error.response?.data?.data?.map(e => `${e.message}`).join(", ");
        console.error("All error", allErrors)
        throw new Error(allErrors || "choose content category");
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
        console.log("1 data:", data)
        // 1. Upload ảnh trước nếu có
        let imageUrl = data.image;
        console.log("2 image:", imageUrl)
        if (data.image instanceof File) {
            imageUrl = await uploadFile(data.image, "images/content_speaking");
        }
        console.log("3 image:", imageUrl)
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
        throw new Error(allErrors || "Can not update ");
    }
}

const getPageContentSpeaking = async (page, size) => {
    return axios.get(`/api/content_speaking?page=${page}&size=${size}`)
}

const acceptContent = async (id) => {
    try {
        return await axios.patch(`/api/content_speaking/accept/${id}`)
    } catch (error) {
        const allErrors = error.response?.data?.message
        throw new Error(allErrors || "can not accept");
    }
}

const rejectContent = (id) => {
    return axios.patch(`/api/content_speaking/reject/${id}`)
}

const getContentSpeakingByLever = (jlptLevel) => {
    return axios.get(`/api/content_speaking/jlptLevel?jlptLevel=${jlptLevel}`)
}

const inActiveContent = (id) => {
    return axios.patch(`/api/content_speaking/inactive/${id}`)
}

export {
    getPageContentSpeaking, handleUpdateContent, fetchAllContentSpeaking, fetchAllContentCategorySpeaking,
    handleCreateContent, handleDeleteContent, acceptContent, rejectContent, getContentSpeakingByLever,
    inActiveContent
};