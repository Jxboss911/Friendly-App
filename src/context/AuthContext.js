import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Prevent early navigation
    const navigate = useNavigate();

    const checkProfileCompletion = async (userUid) => {
        try {
            const userRef = doc(db, "users", userUid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (!userData.profileComplete) {
                    navigate("/profile-setup");
                    return false; // Profile is incomplete
                }
                return true; // Profile is complete
            } else {
                console.warn("User document not found.");
                return false;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return false;
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const isComplete = await checkProfileCompletion(authUser.uid);
                if (isComplete) {
                    navigate("/user");
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p>Loading...</p>; // Prevents premature rendering

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};