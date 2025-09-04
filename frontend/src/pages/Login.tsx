import "../styles/auth.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { http } from "../api/http";
import Spinner from "../components/Spinner";
import type { Credentials, TokenResponse } from "../types/auth";

export default function Login() {
  const [form, setForm] = useState<Credentials>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await http.post<TokenResponse>("/login", form);
      localStorage.setItem("token", data.access_token);
      navigate("/protected");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Login</h1>
      <form onSubmit={submit} className="auth-form">
        <input
          className="auth-input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="auth-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {loading && <Spinner />}
      {error && <p className="auth-error">{error}</p>}
      <div className="auth-footer">
        Don’t have an account?{" "}
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
