import axios from "axios";
const DoExerciseService = {
  doExercise: async (exerciseId, userId) => {
    try {
      const response = await axios.post(`/api/exercises/${exerciseId}/do`, {
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error starting exercise:", error);
      throw error;
    }
  },

  getExerciseDetails: async (exerciseId) => {
    try {
      const response = await axios.get(`/api/exercises/${exerciseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise details:", error);
      throw error;
    }
  },

  getExerciseResults: async (exerciseId, userId) => {
    try {
      const response = await axios.get(`/api/exercises/${exerciseId}/results`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching exercise results:", error);
      throw error;
    }
  },
};

export default DoExerciseService;
