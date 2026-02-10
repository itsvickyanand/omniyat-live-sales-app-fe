"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AdminAuthPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  // check auth on load
  const checkAuth = async () => {
    try {
      const res = await fetch(`${API}/admin/check`, {
        credentials: "include",
      });

      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // login
  const handleLogin = async () => {
    try {
      setProcessing(true);

      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        alert("Invalid password");
        return;
      }

      setPassword("");
      setIsAuthenticated(true);
      router.push("/dashboard");
    } catch {
      alert("Login failed");
    } finally {
      setProcessing(false);
    }
  };

  // logout
  const handleLogout = async () => {
    try {
      setProcessing(true);

      await fetch(`${API}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
    } catch {
      alert("Logout failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg flex flex-col items-center justify-center gap-1 rounded-lg p-6 w-80">
        <h1 className="text-xl font-semibold mb-4 text-center">Admin Panel</h1>

        {!isAuthenticated ? (
          <>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full px-3 py-2 rounded mb-4"
            />

            <button
              onClick={handleLogin}
              disabled={processing}
              className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
            >
              {processing ? "Logging in..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <div className="text-green-600 text-center mb-4">
              You are logged in
            </div>

            <button
              onClick={handleLogout}
              disabled={processing}
              className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
            >
              {processing ? "Logging out..." : "Logout"}
            </button>
          </>
        )}
        <Link href="/dashboard" className="border-1 p-2 font-semibold">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
