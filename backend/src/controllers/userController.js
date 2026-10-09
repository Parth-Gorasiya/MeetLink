import { User } from "../models/userModels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meetingModel.js";

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required",
        });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        const token = crypto.randomBytes(20).toString("hex");

        user.token = token;
        await user.save();

        return res.status(200).json({ token });
    } catch (err) {
        console.error("Login error:", err);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            message: "Name, username, and password are required",
        });
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({
            message: "User registered",
        });
    } catch (err) {
        console.error("Registration error:", err);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    if (typeof token !== "string" || !token.trim()) {
        return res.status(401).json({ message: "Token is required" });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const meetings = await Meeting.find({
            user_id: user.username,
        });

        return res.status(200).json(meetings);
    } catch (error) {
        console.error("Get history error:", error);
        return res.status(500).json({
            message: "Failed to fetch meeting history",
        });
    }
};

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    if (typeof token !== "string" || !token.trim()) {
        return res.status(401).json({ message: "Token is required" });
    }

    if (typeof meeting_code !== "string" || !meeting_code.trim()) {
        return res.status(400).json({
            message: "Meeting code is required",
        });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code.trim(),
        });

        await newMeeting.save();

        return res.status(201).json({
            message: "Added code to history",
        });
    } catch (error) {
        console.error("Add history error:", error);
        return res.status(500).json({
            message: "Failed to save meeting history",
        });
    }
};

export { login, register, getUserHistory, addToHistory };