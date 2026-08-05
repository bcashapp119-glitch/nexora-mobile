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

<div id="details"></div>

`;



const userList = document.getElementById("userList");


const snapshot = await getDocs(collection(db,"users"));


let output = "";


snapshot.forEach((item)=>{


const user = item.data();


output += `

<div style="
background:white;
padding:15px;
margin:15px;
border-radius:12px;
box-shadow:0 2px 8px #ddd;
">


<h3>${user.Name || "No Name"}</h3>

<p>Email: ${user.Email || ""}</p>

<p>Status: ${user.Status || ""}</p>

<p>Wallet: ₦${user.Wallet || 0}</p>


<button onclick="viewUser(
'${item.id}',
'${user.Name}',
'${user.Email}',
'${user.Status}',
'${user.Wallet}'
)">
View Details
</button>


</div>

`;

});


userList.innerHTML = output;



window.viewUser = function(id,name,email,status,wallet){


document.getElementById("details").innerHTML = `

<hr>

<h2>Edit User</h2>

<p>Name: ${name}</p>

<p>Email: ${email}</p>


<label>Status:</label>

<input id="editStatus" value="${status}">


<br><br>


<label>Wallet:</label>

<input id="editWallet" type="number" value="${wallet}">


<br><br>


<button onclick="saveUser('${id}')">
Save Changes
</button>


`;

};



window.saveUser = async function(id){


const newStatus =
document.getElementById("editStatus").value;


const newWallet =
Number(document.getElementById("editWallet").value);



await updateDoc(
doc(db,"users",id),
{
Status:newStatus,
Wallet:newWallet
}
);



alert("User updated successfully");


location.reload();


};


});