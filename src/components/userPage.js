
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, query, where, getDocs, collection } from "firebase/firestore";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";  // Import the ChatMessages component

// defines functional react component called UserPage this will handle the logic of page
const UserPage = () => {
    // userData will hold an object containing firstName, lastName, age and college and setUserData will update this
    const [userData, setUserData] = useState(null);
    // otherUserEmail will store the email adress of the user that the logged in user wants to chat with
    const [otherUserEmail, setOtherUserEmail] = useState("");
    // we need to identify the other user in the system through its unique id so we can communicate with them
    const [otherUserId, setOtherUserId] = useState(null);
    // loading will contain whether or not the app is currently fethcing data or not. By default its set to false meaning it is not fetching or loading data to begin.
    const [loading, setLoading] = useState(false);
    

    // this will be used to fetch the data from the user
    useEffect(() => {
        // we use an asynchronous function because it has to ask the firestore for the data
        const fetchUserData = async () => {
            // retrieving the currently authenticated user and storing it in user
            const user = auth.currentUser;

            // if the user exists, create a reference to the exact user's Firestore document
            // so userRef will reference the user doc but now we have to actually get the doc
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid); // corrected syntax issue
                    // await makes sure the function waits for Firestore to return the document
                    const userSnap = await getDoc(userRef);

                    // check whether or not the user document exists in Firestore 
                    // because if it doesn't, we will have an empty userSnap with no data that will cause an error
                    // if userSnap exists we update variable userData by extracting the userSnap data with userSnap.data()
                    if (userSnap.exists()) {
                        setUserData(userSnap.data());
                    } else {
                        console.warn("User document not found.");
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            }
        };

        fetchUserData();
    }, []);

    // need asynchronous function that will search for a user in firestore by their email address and retrieves the unique user ID
    // the function will be triggered when the user enters an email and tries to search for it
    const findUserbyEmail = async () => {

        // setting this to true means that it will show the webpage is trying to load the email searched for creating better user experience.
        setLoading(true);


        // find the user by email check if the user exists and if they do update the otherUser id with the user unique id

        // a query will allow us to filter an d retrieve specific documents from the users collection
        // store the query in userQuery 
        try{
        const userQuery = query(
            collection(db, "users"), // retrive user collection from firestore
            where("email", "==", otherUserEmail.trim() ) //Filters documents, selecting only those where the email field matches the value stored in otherUserEmail. The otherUserEmail variable represents the other user's email, allowing us to find the UID associated with that account in Firestore.
        );
        
        // now we need to actually execute the query. So w euse await to ensure the function wait for the query to complete before we can move on
        const querySnapshot = await getDocs(userQuery); // getDocs(userQuery) retrieves the documents where the email field matches the value of otherUserEmail.

        // we dont user querySnapshot.exists because thats used for a single document and in this case we are dealing with a query result
        // we must use !querySnapshot.empty to make sure it isnt empty
        if (!querySnapshot.empty){
            const userDoc = querySnapshot.docs[0] // we use querSnapshot.docs beacause we are working with a collection of documents so we must access the first matching document [0]
            // so once we have found the user and the matching document to that user we update the otheruserId by extracting the id of the user
            setOtherUserId(userDoc.id)
        } else {
            console.log("No user found with that email.");
        }
    } catch (err) {
        console.error("Error finding user:", err);
    }
    setLoading(false);
};

// this will create a unique identifier for the chat bettween the current user and another user
// userData && otherUserId checks if userData and otherUserId exist
// we create an array with the current user unique identifier and the other user unique ifentifer 
// then we sort the two user ids in ascending order
const chatId = userData?.uid && otherUserId
    ? [userData.uid, otherUserId].sort().join("_")
    : null;



  return (
    <div>
  <h1>Welcome to Friendly</h1>
  {/* If the user data exists, it will render the user's data; otherwise, it will show "Loading user data..." */}
  {userData ? (
    <div>
      <p><strong>First Name:</strong> {userData.firstName}</p>
      <p><strong>Last Name:</strong> {userData.lastName}</p>
      <p><strong>Age:</strong> {userData.age}</p>
      <p><strong>College:</strong> {userData.college}</p>

      {/* Creates input for entering the other user's email */}
      <div>
        <input
          type="email"
          value={otherUserEmail}
          onChange={(e) => setOtherUserEmail(e.target.value)}
          placeholder="Enter email of the person you want to chat with"
        />

        {/* When we press this button, it will trigger the findUserByEmail function.
            We disable the button while loading to prevent multiple clicks.
            If loading is true, it will display "Searching..."; otherwise, it will show "Find User". */}
        <button onClick={findUserbyEmail} disabled={loading}>
          {loading ? "Searching..." : "Find User"}
        </button>
      </div>

      {/* This part will only render if otherUserId is found, meaning the search was successful */}
      {otherUserId && (
        <ChatMessages
          chatId={chatId} // Passes the unique chat ID generated from both user IDs
          senderId={auth.currentUser.uid} // Passes the current user's ID
          senderName={userData.firstName} // Passes the current user's name for personalization
          receiverId={otherUserId} // Passes the found user's ID to establish a chat
        />
      )}
    </div>
  ) : (
    <p>Loading user data...</p>
  )}
</div>
      )
    }

export default UserPage;