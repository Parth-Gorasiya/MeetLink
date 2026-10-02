import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: "http://localhost:8000/api/v1/users",
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

    const data = {
        userData,
        setUserData,
        handleRegister,
        handleLogin,
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
};