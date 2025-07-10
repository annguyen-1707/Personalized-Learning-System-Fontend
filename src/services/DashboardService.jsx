import axios from "./customixe-axios";

const getCoureraRateFromAPI = (selectedSubjectIds) => {
    console.log("Subject", selectedSubjectIds)
    return axios.post('api/dashboard/couseraRate', selectedSubjectIds);
}

const getOverviewFromAPI = () => {
    return axios.get(`api/dashboard/overview`)
}

const getMonthlyUserFromAPI = (year) => {
    return axios.get(`api/dashboard/totalUserEachMonth?year=${year}`)
}

const getAllSubjectFromAPI = () => {
    return axios.get(`api/subjects/getListAllSubjectActive`)
}
export {
    getCoureraRateFromAPI, getOverviewFromAPI, getMonthlyUserFromAPI, getAllSubjectFromAPI
}