import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
    const [quizDatas, setQuizDatas] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <QuizContext.Provider value={{
            quizDatas, setQuizDatas, loading,
            setLoading
        }}>
            {children}
        </QuizContext.Provider>
    );
};