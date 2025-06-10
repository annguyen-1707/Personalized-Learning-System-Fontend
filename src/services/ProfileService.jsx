import axios from "./customixe-axios";

const getLearningProgressFromAPI = () => {
    var res = axios.get(`/api/profile/overview/learning_progress?userId=1`);
    return res;
}

const getProgressVocabularyFromAPI = () => {
    var res = axios.get(`/api/profile/progress/vocabulary?userId=1`);
    return res;
}

const getProgressGrammarFromAPI = () => {
    var res = axios.get(`/api/profile/progress/grammar?userId=1`);
    return res;
}

const getProgressExerciseFromAPI = () => {
    var res = axios.get(`/api/profile/progress/exercise?userId=1`);
    return res;
}

export {
    getLearningProgressFromAPI, getProgressVocabularyFromAPI, getProgressGrammarFromAPI, getProgressExerciseFromAPI
}