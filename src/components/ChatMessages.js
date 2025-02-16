import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot, addDoc, doc, setDoc, Timestamp } from "firebase/firestore";

const ChatMessages = ({ chatId, senderId, receiverId, senderName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef(null); // Reference for the chat container

    useEffect(() => {
        if (!chatId) return;

        // Reference to the messages subcollection within the specific chat
        const messagesRef = collection(db, "chats", chatId, "messages");

        // Query messages ordered by createdAt
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        // Listen for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Messages snapshot: ", snapshot);
            const fetchedMessages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe(); // Cleanup function to remove listener when component unmounts
    }, [chatId]);

    const sendMessage = async () => {
        if (!newMessage) return;

        // Reference to the chat document
        const chatRef = doc(db, "chats", chatId);

        // Create or update the chat document (if doesn't exist)
        await setDoc(
            chatRef,
            {
                chatId,
                participants: [senderId, receiverId],
            },
            { merge: true }
        );

        // Add the new message to the messages subcollection
        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: newMessage,
            senderId,
            senderName: senderName || "Sender Name", // Use senderName prop or fallback
            receiverId,
            createdAt: Timestamp.fromDate(new Date()), // Use Firestore Timestamp for better real-time updates
        });

        setNewMessage(""); // Clear the input field
    };

    useEffect(() => {
        // Scroll to the bottom when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            {/* Scrollable chat container */}
            <div
                ref={chatContainerRef} // Attach the ref to the chat container
                style={{
                    maxHeight: "400px",
                    overflowY: "scroll",
                    marginBottom: "20px",
                    paddingRight: "10px", // Prevents right-side cut-off when scrollbar appears
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            textAlign: msg.senderId === senderId ? "right" : "left",
                            backgroundColor: msg.senderId === senderId ? "#dcf8c6" : "#f0f0f0",
                            padding: "10px",
                            margin: "5px",
                            borderRadius: "10px",
                            display: "block", // Keeps messages stacked vertically
                            maxWidth: "70%",
                            clear: "both", // Ensures no floating elements
                        }}
                    >
                        <strong>{msg.senderName}: </strong> {msg.text}
                    </div>
                ))}
            </div>

            {/* Input and send button */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message"
                    style={{ padding: "10px", width: "80%", marginRight: "10px" }}
                />
                <button
                    onClick={sendMessage}
                    style={{
                        padding: "10px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatMessages;