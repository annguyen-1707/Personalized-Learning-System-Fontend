import axios from "../services/customixe-axios";

const fetchAllGrammar = async (page, size) => {
  try {
    const response = await axios.get(`/api/grammars/all?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all grammar:", error);
    throw error;
  }
};

const getPageAllVocabulary = async (page, size) => {
  try {
    const response = await axios.get(`/api/vocabularies/all?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all vocabulary:", error);
    throw error;
  }
};

const editVocabulary = async (vocabulary) => {
  try {
    const response = await axios.put(`/api/vocabularies/${vocabulary.id}`, vocabulary);
    return response.data;
  } catch (error) {
    console.error("Error editing vocabulary:", error);
    throw error;
  }
};

const addVocabulary = async (vocabulary) => {
  try {
    const response = await axios.post(`/api/vocabularies`, vocabulary);
    return response.data;
  } catch (error) {
    console.error("Error adding vocabulary:", error);
    throw error;
  }
};

export {
    fetchAllGrammar,
    getPageAllVocabulary,
    editVocabulary,
    addVocabulary,
}
