import React from "react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export default function LandingPage({ onGetStarted, onLogin, onSignUp }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative flex items-center px-8 py-4 shadow bg-white">
        <div className="text-xl font-bold z-10">Library Management System</div>
        {/* Center nav */}
        <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>
        {/* Right buttons */}
        <div className="ml-auto flex space-x-4 z-10">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            onClick={onLogin}
          >
            Log In
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
            onClick={onSignUp}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Library, Simplified</h2>
        <p className="text-lg text-gray-600 max-w-xl mb-6">
          Your PCU Library, now just a click away!
        </p>
        <div className="space-x-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
}