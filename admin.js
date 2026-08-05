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


onAuthStateChanged(auth, async (user)=>{


if(!user){

window.location.href="login.html";

return;

}


document.getElementById("app").innerHTML = `

<h1>Nexora Admin Dashboard</h1>

<p>Admin: ${user.email}</p>

<hr>

<h2>Users</h2>

<div id="users">
Loading users...
</div>

`;



const usersDiv = document.getElementById("users");


const snapshot = await getDocs(collection(db,"users"));


let html = "";


snapshot.forEach((doc)=>{

const data = doc.data();


html += `

<div style="background:white;padding:15px;margin:10px;border-radius:10px">

<h3>${data.name || "User"}</h3>

<p>Email: ${data.email || ""}</p>

<p>Status: ${data.status || ""}</p>

<p>Wallet: ₦${data.wallet || 0}</p>

</div>

`;

});


usersDiv.innerHTML = html;


});