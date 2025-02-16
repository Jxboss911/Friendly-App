import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import SignUpPage from './components/SignUpPage';  
import LoginPage from './components/LoginPage'; 
import UserPage from "./components/userPage";  
import ProfileSetupPage from "./components/ProfileSetupPage";


function App() {
  return (
    
    <Router> {/* Wrap everything inside Router */}
      <AuthProvider> {/* AuthProvider inside Router */}
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
