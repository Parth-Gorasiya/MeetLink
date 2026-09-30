import { User } from "../models/userModels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

export { login, register };