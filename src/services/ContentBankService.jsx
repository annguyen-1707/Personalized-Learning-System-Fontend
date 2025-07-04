import axios from "../services/customixe-axios";

const fetchGrammar = async (page, size) => {
  try {
    const response = await axios.get(
      `/api/grammars/all?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all grammar:", error);
    throw error;
  }
};

const updateGrammar = async (grammarId, grammar) => {
  try {
    const response = await axios.put(`/api/grammars/${grammarId}`, grammar);
    return response.data;
  } catch (error) {
    console.error("Error updating grammar:", error);
    throw error;
  }
};

const addGrammar = async (grammar) => {
  try {
    const response = await axios.post(`/api/grammars`, grammar);
    return response.data;
  } catch (error) {
    console.error("Error adding grammar:", error);
    throw error;
  }
};

const deleteGrammar = async (grammarId) => {
  try {
    const response = await axios.delete(`/api/grammars/${grammarId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting grammar:", error);
    throw error;
  }
};

const getPageAllVocabulary = async (page, size) => {
  try {
    const response = await axios.get(
      `/api/vocabularies/all?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all vocabulary:", error);
    throw error;
  }
};

const editVocabulary = async (vocabularyId, vocabulary) => {
  try {
    const response = await axios.put(
      `/api/vocabularies/${vocabularyId}`,
      vocabulary
    );
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
    const response = await axios.post(
      `/api/vocabularies/${vocabularyId}/add-to-lesson/${lessonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error adding vocabulary to lesson:", error);
    throw error;
  }
};

const getAllVocabWithoutLesson = async (lessonId, page, size) => {
  try {
    const response = await axios.get(
      `/api/vocabularies/get-all-without-lesson/${lessonId}?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching vocabularies without lesson:", error);
    throw error;
  }
};

const getPageAllGrammar = async (lessonId, page, size) => {
  try {
    const response = await axios.get(
      `/api/grammars/not-in-lesson/${lessonId}?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all grammar:", error);
    throw error;
  }
};
const handleAddGrammarInLesson = async (lessonId, grammarId) => {
  try {
    const response = await axios.post(
      `/api/grammars/${grammarId}/add-to-lesson/${lessonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error adding grammar to lesson:", error);
    throw error;
  }
};

const acceptCourse = async (courseId) => {
  try {
    const response = await axios.patch(`/api/subjects/accept/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting course:", error);
    throw error;
  }
}

const rejectCourse = async (courseId) => {
  try {
    const response = await axios.patch(`/api/subjects/reject/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting course:", error);
    throw error;
  }
};

export {
  getPageAllVocabulary,
  editVocabulary,
  addVocabulary,
  deleteVocabulary,
  addVocabularyInLesson,
  getAllVocabWithoutLesson,
  getPageAllGrammar,
  handleAddGrammarInLesson,
  fetchGrammar,
  updateGrammar,
  addGrammar,
  deleteGrammar,
  acceptCourse,
  rejectCourse
};
