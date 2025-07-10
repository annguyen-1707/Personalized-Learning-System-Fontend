import axios from "./customixe-axios";
import { uploadFile } from './UploadFileService';
import { toast } from "react-toastify";
const fetchAllContentReading = () => {
    return axios.get(`/api/content_reading`)
}

const fetchAllContentCategoryReading = () => {
    return axios.get(`/api/content/category/reading`)
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
    console.log("data before create", data)
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
            timeNew: data.timeNew,
            status: data.status,
            jlptLevel: data.jlptLevel
        };
        console.log("data before post", formData)
        const response = await axios.post(`/api/content_reading`, formData);
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


const getPageAllVocabulary = async (page, size) => {
    console.log("After", page, size)
    return axios.get(`/api/vocabularies/all?page=${page - 1}&size=${size}`)
}

const handleAddVocabulary = async (contentReadingId, vocabularyId) => {
    return axios.patch(`/api/content_reading/${contentReadingId}/add_vocabulary/${vocabularyId}`)
}

const handleRemoveVocabulary = async (contentReadingId, vocabularyId) => {
    return axios.patch(`/api/content_reading/${contentReadingId}/remove_vocabulary/${vocabularyId}`)
}

const getVocabularyByContentReadingId = async (id) => {
    return axios.get(`/api/content_reading/${id}/vocabularies`)
}


const getPageAllGrammar = async (page, size) => {
    console.log("After", page, size)
    return axios.get(`/api/grammars/all?page=${page - 1}&size=${size}`)
}

const handleAddGrammar = async (contentReadingId, grammarId) => {
    return axios.patch(`/api/content_reading/${contentReadingId}/add_grammar/${grammarId}`)
}

const handleRemoveGrammar = async (contentReadingId, grammarId) => {
    return axios.patch(`/api/content_reading/${contentReadingId}/remove_grammar/${grammarId}`)
}

const getGrammarByContentReadingId = async (id) => {
    return axios.get(`/api/content_reading/${id}/grammars`)
}

const acceptContent = (id) => {
    try {
    return axios.patch(`/api/content_reading/accept/${id}`)
    } catch (error) {
        const allErrors = error.response?.data?.message
        console.log("All error", allErrors)
        throw new Error(allErrors || "can not accept");
    }
}

const rejectContent = (id) => {
    return axios.patch(`/api/content_reading/reject/${id}`)
}

const inActiveContent = (id) => {
    return axios.patch(`/api/content_reading/inactive/${id}`)
}
export {
    getPageContentReading, handleUpdateContent, fetchAllContentReading, fetchAllContentCategoryReading, handleCreateContent, handleDeleteContent,
    getPageAllVocabulary, handleAddVocabulary, handleRemoveVocabulary, getVocabularyByContentReadingId, getPageAllGrammar, handleAddGrammar, handleRemoveGrammar
    , getGrammarByContentReadingId, acceptContent,rejectContent,inActiveContent
}