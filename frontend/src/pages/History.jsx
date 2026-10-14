import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";

function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();

                if (active) {
                    setMeetings(history);
                }
            } catch (error) {
                if (active) {
                    setError(
                        error.response?.data?.message ||
                        "Failed to load meeting history"
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchHistory();

        return () => {
            active = false;
        };
    }, [getHistoryOfUser]);

    const formatDate = (dateString) => {
        if (!dateString) return "Date unavailable";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    return (
        <div>
            <IconButton
                aria-label="Go to home"
                onClick={() => navigate("/home")}
            >
                <HomeIcon />
            </IconButton>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Meeting History
            </Typography>

            {loading ? (
                <Typography>Loading history...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : meetings.length === 0 ? (
                <Typography>No meeting history yet.</Typography>
            ) : (
                meetings.map((meeting) => (
                    <Card
                        key={meeting._id}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        <CardContent>
                            <Typography color="text.secondary">
                                Code: {meeting.meetingCode}
                            </Typography>

                            <Typography color="text.secondary">
                                Date: {formatDate(meeting.date)}
                            </Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}

export default withAuth(History);