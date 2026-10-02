import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "@mui/material/Snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";

const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const changeForm = (state) => {
        setFormState(state);
        setError("");
    };

    const handleAuth = async (event) => {
        event.preventDefault();

        if (loading) return;

        setError("");

        if (
            !username.trim() ||
            !password ||
            (formState === 1 && !name.trim())
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            if (formState === 0) {
                await handleLogin(username.trim(), password);
            } else {
                const result = await handleRegister(
                    name.trim(),
                    username.trim(),
                    password
                );

                setMessage(
                    typeof result === "string"
                        ? result
                        : "Registration successful. Please sign in."
                );

                setOpen(true);
                setUsername("");
                setPassword("");
                setName("");
                setFormState(0);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to complete the request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (_event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />

            <Box
                component="main"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                }}
            >
                <Box
                    sx={{
                        display: { xs: "none", sm: "block" },
                        width: { sm: "33.333%", md: "58.333%" },
                        backgroundColor: "grey.100",
                        backgroundImage: "url(/mobile.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                    }}
                />

                <Paper
                    elevation={6}
                    square
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "66.667%",
                            md: "41.667%",
                        },
                    }}
                >
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                            <Button
                                variant={
                                    formState === 0 ? "contained" : "text"
                                }
                                disabled={loading}
                                onClick={() => changeForm(0)}
                            >
                                Sign In
                            </Button>

                            <Button
                                variant={
                                    formState === 1 ? "contained" : "text"
                                }
                                disabled={loading}
                                onClick={() => changeForm(1)}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box
                            component="form"
                            onSubmit={handleAuth}
                            noValidate
                            sx={{ mt: 1, width: "100%" }}
                        >
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    disabled={loading}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                value={username}
                                disabled={loading}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                autoComplete={
                                    formState === 0
                                        ? "current-password"
                                        : "new-password"
                                }
                                value={password}
                                disabled={loading}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            {error && (
                                <Box
                                    role="alert"
                                    sx={{ color: "error.main", mt: 2 }}
                                >
                                    {error}
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                {loading
                                    ? "Please wait..."
                                    : formState === 0
                                      ? "Login"
                                      : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                message={message}
            />
        </ThemeProvider>
    );
}