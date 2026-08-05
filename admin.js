import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
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


onAuthStateChanged(auth, async (admin)=>{

if(!admin){

appDiv.innerHTML = "Please login first";
return;

}


appDiv.innerHTML = `

<h1>Nexora Admin Dashboard</h1>

<p>Admin: ${admin.email}</p>

<hr>

<h2>Users</h2>

<div id="users">
Loading users...
</div>


<hr>

<h2>Transactions</h2>

<div id="transactions">
Loading transactions...
</div>


<div id="details"></div>

`;


loadUsers();

loadTransactions();


});



async function loadUsers(){


const usersDiv = document.getElementById("users");

const snap = await getDocs(collection(db,"users"));


let html = "";


snap.forEach((item)=>{


const u = item.data();


html += `

<div style="
background:white;
padding:15px;
margin:10px;
border-radius:12px;
">

<h3>${u.Name || "No Name"}</h3>

<p>Email: ${u.Email || ""}</p>

<p>Status: ${u.Status || ""}</p>

<p>Wallet: ₦${u.Wallet || 0}</p>


<button onclick="viewUser('${item.id}')">
View User
</button>


</div>

`;

});


usersDiv.innerHTML = html || "No users";


}



window.viewUser = async function(id){


const userDoc = await getDocs(collection(db,"users"));

let found;


userDoc.forEach((d)=>{

if(d.id === id){

found = d.data();

}

});


document.getElementById("details").innerHTML = `

<h2>User Details</h2>

<p>Name: ${found.Name || ""}</p>

<p>Email: ${found.Email || ""}</p>

<p>Status: ${found.Status || ""}</p>

<p>Wallet: ₦${found.Wallet || 0}</p>

`;

};



async function loadTransactions(){


const div = document.getElementById("transactions");


const snap = await getDocs(collection(db,"transactions"));


let html = "";


snap.forEach((item)=>{


const t = item.data();


html += `

<div style="
background:white;
padding:15px;
margin:10px;
border-radius:12px;
">


<h3>Transaction</h3>


<pre>
${JSON.stringify(t,null,2)}
</pre>


</div>

`;

});


div.innerHTML = html || "No transactions found";


}