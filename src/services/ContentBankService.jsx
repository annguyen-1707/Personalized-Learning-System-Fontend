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

const editVocabulary = async (vocabularyId, vocabulary) => {
  try {
    const response = await axios.put(`/api/vocabularies/${vocabularyId}`, vocabulary);
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

const deleteVocabulary = async (vocabularyId) => {
  try {
    const response = await axios.delete(`/api/vocabularies/${vocabularyId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting vocabulary:", error);
    throw error;
  }
};

const addVocabularyInLesson = async (lessonId, vocabularyId) => {
  try {
    const response = await axios.post(`/api/vocabularies/${vocabularyId}/add-to-lesson/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("Error adding vocabulary to lesson:", error);
    throw error;
  }
};

export {
    fetchAllGrammar,
    getPageAllVocabulary,
    editVocabulary,
    addVocabulary,
    deleteVocabulary,
    addVocabularyInLesson
};
