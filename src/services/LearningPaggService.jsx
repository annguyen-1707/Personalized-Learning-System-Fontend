
const getAllSubjectsById = async (page) => {
    const res = await fetch(`api/subjects/students?page=${page}`, {
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
    try {
        const res = await fetch(`api/subjects/all-courses?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Error from API:", errorData);
            // fallback
            return await getAllCoursesWithoutAuth(page);
        }

        const data = await res.json();
        return data.data;

    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
}


const enrollInCourse = async (subjectId) => {

    const res = await fetch(`api/subject-enrollments?subjectId=${subjectId}`, {
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

const getAllCoursesWithoutAuth = async (page) => {
    const res = await fetch(`api/subjects/client-all-courses?page=${page}`);
    if (!res.ok) {
        let data = await res.json();
        return data;
    }
    let data = await res.json();
    return data.data;
}

export const LearningPaggService = {
    getAllSubjects,
    enrollInCourse,
    getAllSubjectsById,
    getAllCoursesWithoutAuth,
};              
// export default LearningPaggService;
export default LearningPaggService;