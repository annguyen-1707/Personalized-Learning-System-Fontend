import axios from "./customixe-axios";
import uploadFile from "./UploadFileService";

const getLearningProgressFromAPI = () => {
    var res = axios.get(`/api/profile/overview/learning_progress`);
    return res;
}

const getProgressVocabularyFromAPI = () => {
    var res = axios.get(`/api/profile/progress/vocabulary`);
    return res;
}

const getProgressGrammarFromAPI = () => {
    var res = axios.get(`/api/profile/progress/grammar`);
    return res;
}

const getProgressExerciseFromAPI = () => {
    var res = axios.get(`/api/profile/progress/exercise`);
    return res;
}
const getStudentInfoFromAPI = () => {
    var res = axios.get(`/api/profile/information`);
    return res;
}

const handleAvatarUploadFromAPI = async (data) => {
    try {
        const imageUrl = await uploadFile(data, "images/avatar");
        const response = await axios.patch(`/api/profile/updateAvatar?avatar=${imageUrl}`);
        return response;
    } catch (error) {
        console.error("Error appending file to formData:", error);
    }
}

export {
    getLearningProgressFromAPI, getProgressVocabularyFromAPI, getProgressGrammarFromAPI, getProgressExerciseFromAPI, getStudentInfoFromAPI, handleAvatarUploadFromAPI
}