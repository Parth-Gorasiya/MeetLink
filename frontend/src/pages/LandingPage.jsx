import "../App.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";

export default function LandingPage() {
    const navigate = useNavigate();

    const [guestDialogOpen, setGuestDialogOpen] = useState(false);
    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");

    const openGuestDialog = () => {
        setMeetingCode("");
        setError("");
        setGuestDialogOpen(true);
    };

    const handleGuestJoin = (event) => {
        event.preventDefault();

        const code = meetingCode.trim();

        if (!code) {
            setError("Please enter a meeting code");
            return;
        }

        if (["auth", "home", "history"].includes(code.toLowerCase())) {
            setError("This code is reserved. Please check your meeting code.");
            return;
        }

        navigate(`/${encodeURIComponent(code)}`);
    };

    return (
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Meet Link</h2>
                </div>

                <div className="navlist">
                    <p onClick={openGuestDialog}>
                        Join as Guest
                    </p>

                    <p onClick={() => navigate("/auth")}>
                        Register
                    </p>

                    <div
                        onClick={() => navigate("/auth")}
                        role="button"
                    >
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div>
                    <h1>
                        <span style={{ color: "#FF9839" }}>
                            Connect with your Loved Ones
                        </span>
                    </h1>

                    <p>Cover a distance by Meet Link</p>

                    <div role="button">
                        <Link to="/auth">Get Started</Link>
                    </div>
                </div>

                <div>
                    <img
                        src="/mobile.png"
                        alt="MeetLink video conferencing"
                    />
                </div>
            </div>

            <Dialog
                open={guestDialogOpen}
                onClose={() => setGuestDialogOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <form onSubmit={handleGuestJoin}>
                    <DialogTitle>Join as Guest</DialogTitle>

                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            margin="dense"
                            label="Meeting Code"
                            value={meetingCode}
                            onChange={(event) => {
                                setMeetingCode(event.target.value);
                                setError("");
                            }}
                            error={Boolean(error)}
                            helperText={error || "Enter the code shared by the host"}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={() => setGuestDialogOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" variant="contained">
                            Join
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}