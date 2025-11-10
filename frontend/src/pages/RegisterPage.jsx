import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
  TextField,
  Button,
  Alert,
  CircularProgress
} from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

const RegisterPage  = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        password
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 3,
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(245,247,250,1) 100%)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={3}
          color="primary.main"
        >
          Register
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Stack
          component="form"
          spacing={3}
          sx={{ mt: 2, alignItems: 'center' }}
          onSubmit={handleLogin}
        >
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
          />

          <Button
            variant="contained"
            color="primary"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
            type="submit"
            disabled={loading}
            fullWidth
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 2,
              textTransform: "none",
              mt: 2,
            }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Stack>
        <Divider sx={{ mt: 3 }} />
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Button
                variant="text"
                onClick={() => navigate("/")}
                sx={{ textTransform: "none", ml: 1 }}
            >
                Login
            </Button>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;