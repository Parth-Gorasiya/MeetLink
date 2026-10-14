import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "https://meetlink-backend-fqky.onrender.com/api/v1/users",
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (name, username, password) => {
        const response = await client.post("/register", {
            name,
            username,
            password,
        });

        return response.data.message;
    };

    const handleLogin = async (username, password) => {
        const response = await client.post("/login", {
            username,
            password,
        });

        const { token } = response.data;

        if (!token) {
            throw new Error("Login response did not contain a token");
        }

        localStorage.setItem("token", token);
        navigate("/home");
    };

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token : localStorage.getItem("token"),
                }
            });
            return request.data;
        } catch (error) {
            throw error;
        }
    }

   const addToUserHistory = async (meetingCode) => {
    const response = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
    });

    return response.data;
};
    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin,
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};