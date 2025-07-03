import axios from "../services/customixe-axios";
const DoExerciseService = {
  // doExercise: async (exerciseId, userId) => {
  //   try {
  //     const response = await axios.post(`/api/exercises/${exerciseId}/do`, {
  //       userId,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error starting exercise:", error);
  //     throw error;
  //   }
  // },

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

  getSource: async (exerciseId) => {
    try {
      const res = await axios.get(
        `/api/do-exercises/get-sources?exerciseId=${exerciseId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching exercise sources:", error);
      throw error;
    }
  },

  submitExerciseResult: async (resultData, resultDataDetails) => {
    try {
      const response1 = await axios.post(
        `/api/do-exercises/submit-result`,
        resultData
      );
      if (response1.status == "success") {
        console.log("resultDataDetails", resultDataDetails);

        const response = await axios.post(
          `/api/do-exercises/submit-result-details`,
          resultDataDetails
        );
        console.log(
          "Exercise result submitted successfully:",
          response.data
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error submitting exercise result:", error);
      throw error;
    }
  },
};

export default DoExerciseService;
