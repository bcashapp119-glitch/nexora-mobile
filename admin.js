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


onAuthStateChanged(auth, async (user)=>{


if(!user){

appDiv.innerHTML = "Please login first";
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

<hr>

<div id="details"></div>

`;



const userList = document.getElementById("userList");


const snapshot = await getDocs(collection(db,"users"));


let output = "";


snapshot.forEach((doc)=>{


const userData = doc.data();


output += `

<div style="
background:white;
padding:15px;
margin:10px;
border-radius:12px;
">

<h3>${userData.Name || "No Name"}</h3>

<p>Email: ${userData.Email || "No Email"}</p>

<p>Status: ${userData.Status || "No Status"}</p>

<p>Wallet: ₦${userData.Wallet || 0}</p>


<button onclick="showUser(
'${userData.Name}',
'${userData.Email}',
'${userData.Status}',
'${userData.Wallet}'
)">
View Details
</button>


</div>

`;

});


userList.innerHTML = output;


});



window.showUser = function(name,email,status,wallet){


document.getElementById("details").innerHTML = `

<h2>User Details</h2>

<p><b>Name:</b> ${name}</p>

<p><b>Email:</b> ${email}</p>

<p><b>Status:</b> ${status}</p>

<p><b>Wallet:</b> ₦${wallet}</p>


<button onclick="closeDetails()">
Close
</button>

`;

};



window.closeDetails = function(){

document.getElementById("details").innerHTML = "";

};