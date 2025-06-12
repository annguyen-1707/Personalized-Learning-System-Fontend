import axios from "./customixe-axios";

const getLearningProgressFromAPI = (studentId) => {
  return axios.get(`/api/parent-student/student/overview?userId=${studentId}`)
}

const getProgressVocabularyFromAPI = (studentId) => {
  return axios.get(`/api/parent-student/student/vocabulary?userId=${studentId}`);
}

const getProgressGrammarFromAPI = (studentId) => {
  var res = axios.get(`/api/parent-student/student/grammar?userId=${studentId}`);
  return res;
}

const getProgressExerciseFromAPI = (studentId) => {
  var res = axios.get(`/api/parent-student/student/exercise?userId=${studentId}`);
  return res;
}
const getStudentInfoFromAPI = (studentId) => {
  var res = axios.get(`/api/parent-student/student/information?userId=${studentId}`);
  return res;
}

export {
  getLearningProgressFromAPI, getProgressVocabularyFromAPI, getProgressGrammarFromAPI, getProgressExerciseFromAPI, getStudentInfoFromAPI
}