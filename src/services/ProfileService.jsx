import axios from "./customixe-axios";

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

export {
    getLearningProgressFromAPI, getProgressVocabularyFromAPI, getProgressGrammarFromAPI, getProgressExerciseFromAPI, getStudentInfoFromAPI
}