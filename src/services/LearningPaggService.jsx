
const getAllSubjectsById = async (page) => {
    const userId = 1;
    const res = await fetch(`api/subjects/students?userId=${userId}&page=${page}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    if (!res.ok) {
        let data = await res.json();
        return data;
    }
    let data = await res.json();
    return data.data;
}

const getAllSubjects = async (page) => {
    const userId = 1;
    const res = await fetch(`api/subjects/all-courses?userId=${userId}&page=${page}`, {
    headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    if (!res.ok) {
        let data = await res.json();
            return data;
        }
        let data = await res.json();
        return data.data;
}


const enrollInCourse = async (subjectId) => {
    const userId = 1;
    const res = await fetch(`api/subject-enrollments?subjectId=${subjectId}&userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    if (!res.ok) {
        let data = await res.json();
        return data;
    }
    let data = await res.json();
    return data;
}

export const LearningPaggService = {
    getAllSubjects,
    enrollInCourse,
    getAllSubjectsById,
};              
// export default LearningPaggService;
export default LearningPaggService;