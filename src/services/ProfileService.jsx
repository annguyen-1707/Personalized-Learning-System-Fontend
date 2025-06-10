import axios from "./customixe-axios";

const getLearningProgressFromAPI = () => {
    var res = axios.get(`/api/profile/overview/learning_progress?userId=1`);
    return res;
}

export {
    getLearningProgressFromAPI
}