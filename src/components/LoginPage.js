import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Correct import // Import Firebase auth instance
import "../LoginPage.css";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate(); // Initialize navigate function

    // defined asynchronous function called handleSubmit.
    // it has to be asynchronous because it allows await
    // Using await allows the program to wait for a response from firebase befroe continuing
    const handleSubmit = async (e) => {
    // avoids a page refresh so info can be handled
    e.preventDefault();
    
    // Clears out any previous error or success messages.
    setError("");
    setSuccessMessage("");

    if(!email || !password) {
        setError("Please fill in all fields.");
        // exits without submitting the form with return
        return;
    }

    // Attempts to sign in the user with Firebase Authentication
    // signInWithEmailAndPassword(auth, email, password) is an async function
    // that sends the email and password to firebase to check if they are valid
    // we use await to wait for firebases response before continuing
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        // Fetch user data from Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
    
        if (userSnap.exists()) {
            const userData = userSnap.data();
            if (!userData.profileComplete) {
                navigate("/profile-setup"); // Redirect to profile setup if incomplete
            } else {
                navigate("/user"); // Redirect to user page if complete
            }
        } else {
            console.warn("User document not found. Redirecting to profile setup.");
            navigate("/profile-setup"); // Assume it's a first-time user if no document exists
        }
    
        setSuccessMessage("Login successful! Redirecting...");
        setEmail("");
        setPassword("");
    } catch (err) {
        setError("Error logging in. Please check your credentials and try again.");
    }
    };


    

    return (
        <div className="login-container">
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      );
    };

    export default LoginPage;  // Default export

