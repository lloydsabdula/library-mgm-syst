import React, { useState } from "react";
import LandingPage from "./web-page/landing-page";
import AuthPage from "./web-page/auth-page";
import StudentDashboard from "./web-page/stud-dashboard";

function App() {
  const [authVisible, setAuthVisible] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [dashboardVisible, setDashboardVisible] = useState(false);

  // Open forms
  const openSignUp = () => {
    setAuthMode("signup");
    setAuthVisible(true);
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthVisible(true);
  };

  // Close AuthPage
  const closeAuth = () => setAuthVisible(false);

  // Called when login or signup succeeds
  const loginSuccess = () => {
    setAuthVisible(false);
    setDashboardVisible(true);
  };

  // Logout from dashboard
  const logout = () => setDashboardVisible(false);

  // Render based on state
  if (dashboardVisible) {
    return <StudentDashboard onLogout={logout} />;
  }

  if (authVisible) {
    return (
      <AuthPage
        initialMode={authMode}
        onBack={closeAuth}
        onSuccess={loginSuccess}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={openSignUp}
      onLogin={openLogin}
      onSignUp={openSignUp}
    />
  );
}

export default App;
