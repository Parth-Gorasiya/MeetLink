import "dotenv/config";

import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";


import userRoutes from "./routes/userRoutes.js";


const app = express();
const server = createServer(app);

connectToSocket(server);

const PORT = process.env.PORT || 8000;
app.set("port", PORT);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
    return res.json({ hello: "World" });
});

const start = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL environment variable is missing");
        }

        const connectionDB = await mongoose.connect(process.env.MONGO_URL);

        console.log(
            `MongoDB connected: ${connectionDB.connection.host}`
        );

        server.listen(PORT, () => {
            console.log(`Listening on Port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

start();