
const getAllSubjects = async (page) => {
    const userId = 1;
    const res = await fetch(`api/subjects/students?userId=${userId}&page=${page}`);
    if (!res.ok) {
        let data = await res.json();
        return data;
    }
    let data = await res.json();
    return data.data;
}

export const LearningPaggService = {
    getAllSubjects
}
// export default LearningPaggService;
export default LearningPaggService;