import React, { useState } from "react";

interface LoginFormProps {
  switchToSignUp: () => void;
  onSuccess: () => void;
}

export default function LoginForm({ switchToSignUp, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
    onSuccess();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input type="email" placeholder="Email" className="px-4 py-2 border rounded-lg" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="px-4 py-2 border rounded-lg" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700">
          Log In
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        <button className="text-blue-600 underline" onClick={switchToSignUp}>
          Don't have an account? Sign Up
        </button>
      </div>
    </>
  );
}
