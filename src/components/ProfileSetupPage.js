// helps control state
import React, {useState} from "react"
//import fire base
import { auth, db } from "../firebaseConfig";
// this will import doc methods allowing us to reference specific dooc like users profile
// setDocc will be used to ipdate the data of the document
import { doc, setDoc } from "firebase/firestore"; 
// naviagte to different routes in the app
import { useNavigate } from "react-router-dom";

const ProfileSetupPage = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [age, setAge] = useState(0);
    const [college, setCollege] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //auth helps mange user sign-ins and sign-outs
    //curentUser  is a property of auth and will hold the details such as uid, email, displayName
    // we need the uid of the user to store their profile data in Firestore under their unique identifier
    const user = auth.currentUser;

    //function to handle submission, it is called when the form is submmitted
const handleSubmit = async (e) => {
    // avoids a page refresh so info can be handled
    e.preventDefault();

    if(!firstName || !lastName || !age || !college){
        setError("Please fill in all fields.");
        // exits without submitting the form with return
        return;
    }

    try{
    // create reference to the user's document in firestor
    const userRef = doc(db, "users", user.uid); //This will access the document in the database for the user with this unique ID
    // user data needs to be seperate in the database so we use uid(unique identifier)
    // now we wait for the user reference and once we know where we can put the data we have setDoc update the document with the specific data
    // we give it the userRef first so it knows where to place the data
    await setDoc(userRef, {
        firstName,
        lastName,
        age,
        college,
        profileComplete: true,
        email: user.email, //add the email field
    }, {merge: true}); // `merge: true` ensures existing data is not overwritten
    navigate("/user");
    }  catch (err) {
        console.error("Error updating profile:", err);
        setError("Error saving profile. Please try again.");
      }
}

return (
    <div>
      <h2>Set up your profile</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="college">College</label>
          <input
            type="text"
            id="college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
        </div>
        <button type="submit">Complete Setup</button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;