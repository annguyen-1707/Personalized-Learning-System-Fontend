import axios from "./customixe-axios";
import axios2 from "axios";
const getListDialogueByContentSpeakingId = async (contentSpeakingId) => {
    return axios.get(`/api/content-speaking-client/${contentSpeakingId}/dialogues`)
}

const getContentSpeakingCategories = async () => {
    return axios.get("api/content/category/speaking");
};

const getPageContentSpeaking = async (page, size) => {
    return axios.get(`/api/content-speaking-client?page=${page}&size=${size}`);
}

const assessPronunciation = async (formData, dialogueId) => {
    console.log("Assessing pronunciation with reference text:", dialogueId);
    return await axios.post(`/api/content-speaking-client/upload?dialogueId=${dialogueId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

const getResultBeforeAssessFromAPI = async (dialogueId) => {
    return axios.get(`/api/content-speaking-client/dialogue/${dialogueId}/progress`)
}

export {
    getListDialogueByContentSpeakingId, getContentSpeakingCategories, getPageContentSpeaking, assessPronunciation,getResultBeforeAssessFromAPI
}