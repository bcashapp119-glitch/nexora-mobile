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

<div class="card">

<h3>${u.Name || u.name || "No Name"}</h3>

<p>Email: ${u.Email || u.email || "No Email"}</p>

<p>Status: ${u.Status || u.status || "No Status"}</p>

<p>Wallet: ₦${u.Wallet || u.wallet || 0}</p>


<button onclick="viewUser('${item.id}')">
View User
</button>


</div>

`;

});


usersDiv.innerHTML = html || "No users found";


}



window.viewUser = async function(id){


const snap = await getDocs(collection(db,"users"));

let userData = null;


snap.forEach((item)=>{

if(item.id === id){

userData = item.data();

}

});


if(!userData){

alert("User not found");
return;

}


alert(`

Name: ${userData.Name || userData.name}

Email: ${userData.Email || userData.email}

Status: ${userData.Status || userData.status}

Wallet: ₦${userData.Wallet || userData.wallet}

`);


};





async function loadTransactions(){


const div = document.getElementById("transactions");

const snap = await getDocs(collection(db,"transactions"));


let html = "";


snap.forEach((item)=>{


const t = item.data();


html += `

<div class="card">

<h3>${t.type || "Transaction"}</h3>

<p>Amount: ₦${t.amount || 0}</p>

<p>Status: ${t.status || ""}</p>

<p>Network: ${t.network || ""}</p>

<p>Phone: ${t.phone || ""}</p>

</div>

`;

});


div.innerHTML = html || "No transactions";


}