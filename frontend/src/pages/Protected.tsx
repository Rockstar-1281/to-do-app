// Protected.tsx
import { useEffect, useState } from "react";
import { http } from "../api/http";
import Spinner from "../components/Spinner";

type ProtectedPayload = { message: string };

export default function Protected() {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await http.get<ProtectedPayload>("/protected");
        setMsg(data.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const logout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 500); // small delay for spinner
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Protected Page</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="auth-form space-y-3">
          <p>{msg}</p>
          <button
            className="auth-button"
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Sign Out"}
          </button>
        </div>
      )}
      {(loading || loggingOut) && <Spinner />}
    </div>
  );
}
