import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AppContext = createContext();

export const AppContextProvider = ({children}) =>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [exams, setExams] = useState([]);
    const [exam, setExam] = useState(null);
    const [candidates, setCandidates] = useState([])
    const [flaggedCandidates, setFlaggedCandidates] = useState([])

    const [totalCandidate, setTotalCcandidate] = useState('')
    const [activeExams, setActiveExams] = useState('2')
    const [flaggedCandidate, setFlaggedCandidate] = useState('4')
    const [highRiskedCandidate, setHighRiskCandidate] = useState('')
    
    const fetchExams = async () => {
        try {
        const { data } = await axios.get(`${backendUrl}/api/exams/get-exams/`);
        if (data.success) {
            setExams(data.exams);
            // console.log(data.exams)
        }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchExam = async () => {
        try {
        const { data } = await axios.get(
            `${backendUrl}/api/exams/get-first-exam/`
        );

        if (data.success) {
            // console.log(data.exam)
            setExam(data.exam);
        }

        } catch (error) {
            console.log(error);
        }
    };

    const fetchCandidates = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/exams/get-examAttempts/${exam.id}`
            );

            if (data.success) {
                console.log(data.attempts);
                setCandidates(data.attempts);
                setTotalCcandidate(data.attempts.length)
                const hCandidateCount = data.attempts.filter(obj => obj.risk === "HIGH").length
                setHighRiskCandidate(hCandidateCount)
            }

        } catch (error) {
            console.log(error);
        }
    };

    const getFlaggedCandidates = async() =>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/exams/get-terminated-candidates/${exam.id}`)

            if(data.success){
                console.log(data.data);
                setFlaggedCandidates(data.data)
            }
        } catch (err) {
            console.log(err);  
        }
    }

    useEffect(() => {
        fetchExams();
        fetchExam();
    }, []);

    useEffect(() => {
        if (exam?.id) {
            fetchCandidates();
            getFlaggedCandidates();
        }
    }, [exam]);


    const value = {
        backendUrl,
        fetchExams,
        exams,
        fetchExam, exam, candidates,
        totalCandidate, highRiskedCandidate, activeExams, flaggedCandidate,
        fetchCandidates, flaggedCandidates
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}