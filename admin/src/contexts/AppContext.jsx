import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AppContext = createContext();

export const AppContextProvider = ({children}) =>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [exams, setExams] = useState([]);

    const fetchExams = async () => {
        try {
        const { data } = await axios.get(`${backendUrl}/api/exams/get-exams/`);
        if (data.success) {
            setExams(data.exams);
            console.log(data.exams)
        }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const value = {
        backendUrl,
        fetchExams,
        exams
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}