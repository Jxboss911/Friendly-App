// This file will handles sending messages
import {useState} from "react";
import {db} from "../firebaseConfig"
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Need to define the ChatInput component and pass in four props from firebase, who sent the message
// who should recieve the message, what chat the message belongs to, and the senders name
// the functional component ChatInput will contain the logic of the program and passes 4 props neccessay for message sending
const ChatInput = ({ chatId, senderId, senderName, receiverId}) => {

    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        // trim removes spaces before checking if the message is empty, if it is empty we return so the program does not run
        if(message.trim() === "") return;

        try{
            // we need to make sure to wait for the message to be saved before we add the new document to the messages collection so we use await
            //collection is a built in function that references a specific collection within the database
            await addDoc(collection(db, "chats", chatId, "messages"), {
            chatId: chatId, //Identifies which chat the message belongs to. This groups messages between specific users.
            senderId: senderId, //The unique ID of the sender.
            senderName: senderName, // The display name of the sender.
            receiverId: receiverId, //  The unique ID of the receiver.
            text: message, // The actual content of the message, which is the value of the message state.
            createdAt: serverTimestamp(), // This uses Firestore's serverTimestamp() to automatically generate a timestamp when the message is created.
            }
        )
        //once the message is sent we need to clear the input 
        setMessage("");

        } catch (error){
            console.error("Error sending message:", error);
        }

    }

    return(
        <div>
            <input
            type="text" //creates text input field
            value={message} // this binds the message to value so the input field always displays the latest message state
            onChange={(e) => setMessage(e.target.value)} // this will update message whener user types
            placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button> {/*If send btton is clicked triggers send button function */}
        </div>
    );


    //function  to send the message needs to be within the functional component
    //because the sendMessage will check if there is a message to be sent and if there is it will send it to firestore
}

export default ChatInput;