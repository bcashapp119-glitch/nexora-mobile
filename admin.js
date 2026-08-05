import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDHwh66V6cT7nqEP9R7Iy827vbtBjQGeIA",
  authDomain: "nexora-mobile-af02f.firebaseapp.com",
  projectId: "nexora-mobile-af02f",
  storageBucket: "nexora-mobile-af02f.firebasestorage.app",
  messagingSenderId: "498265618137",
  appId: "1:498265618137:web:a1ffebae8eda0b88abf0c8",
  measurementId: "G-8494CNWZKL"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


const appDiv = document.getElementById("app");


onAuthStateChanged(auth, async (user) => {


if(!user){

appDiv.innerHTML = `
<h2>Please login first</h2>
`;

return;

}



appDiv.innerHTML = `

<h1>Nexora Admin Dashboard</h1>

<p>Admin: ${user.email}</p>

<hr>

<h2>Users</h2>

<div id="userList">
Loading users...
</div>

`;



const userList = document.getElementById("userList");



try{


const usersSnapshot = await getDocs(collection(db,"users"));


let output = "";


usersSnapshot.forEach((doc)=>{


const userData = doc.data();


output += `

<div style="
background:white;
padding:15px;
margin:10px;
border-radius:12px;
box-shadow:0 2px 8px rgba(0,0,0,0.1);
">

<h3>${userData.Name || "No Name"}</h3>

<p>Email: ${userData.Email || "No Email"}</p>

<p>Status: ${userData.Status || "No Status"}</p>

<p>Wallet: ₦${userData.Wallet || 0}</p>

</div>

`;



});


if(output === ""){

userList.innerHTML = "No users found";

}else{

userList.innerHTML = output;

}



}

catch(error){

userList.innerHTML = `
<h3>Error loading users</h3>
<p>${error.message}</p>
`;

}



});