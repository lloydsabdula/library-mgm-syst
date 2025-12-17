import React, { useState } from "react";
import SignUpForm from "./signup";
import LoginForm from "./login";

interface AuthPageProps {
  initialMode: "signup" | "login";
  onBack: () => void; // Exit to landing page
  onSuccess: () => void; // Login/signup success → dashboard
}

export default function AuthPage({ initialMode, onBack, onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Exit button top-right */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-lg"
          onClick={onBack}
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "signup" ? "Sign Up" : "Log In"}
        </h2>

        {/* Forms */}
        {mode === "signup" && <SignUpForm switchToLogin={() => setMode("login")} onSuccess={onSuccess} />}
        {mode === "login" && <LoginForm switchToSignUp={() => setMode("signup")} onSuccess={onSuccess} />}
      </div>
    </div>
  );
}
