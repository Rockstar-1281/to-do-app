import { useState } from "react";
import { http } from "../api/http";
import Spinner from "../components/Spinner";
import type { Credentials } from "../types/auth";
import "../styles/auth.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState<Credentials>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await http.post("/register", form);
      window.location.href = "/login";
    } catch (e: unknown) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Register</h1>
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {loading && <Spinner />}
      {error && <p className="auth-error">{error}</p>}
      <div className="auth-footer">
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
