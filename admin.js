import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { 
getAuth, 
onAuthStateChanged 
} 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const firebaseConfig = {

apiKey:"AIzaSyDHwh66V6cT7nqEP9R7Iy827vbtBjQGeIA",

authDomain:"nexora-mobile-af02f.firebaseapp.com",

projectId:"nexora-mobile-af02f",

storageBucket:"nexora-mobile-af02f.firebasestorage.app",

messagingSenderId:"498265618137",

appId:"1:498265618137:web:a1ffebae8eda0b88abf0c8",

measurementId:"G-8494CNWZKL"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


const adminEmail = "Sufiyanolawale36@gmail.com";


onAuthStateChanged(auth,(user)=>{


if(!user){

alert("Please login first");

window.location.href="login.html";

return;

}


if(user.email !== adminEmail){

alert("Access Denied");

window.location.href="dashboard.html";

return;

}


// Admin is approved

document.getElementById("app").innerHTML = `

<div style="display:flex;width:100%;">

<div style="
width:240px;
background:#1F2937;
color:white;
padding:20px;
min-height:100vh;
">

<h2>NEXORA ADMIN</h2>

<br>

<p>🏠 Dashboard</p>
<p>👥 Users</p>
<p>💰 Wallets</p>
<p>📱 Airtime</p>
<p>📶 Data</p>
<p>🌍 eSIM</p>
<p>📜 Transactions</p>
<p>⚙ Settings</p>

</div>


<div style="
flex:1;
padding:30px;
background:#F3F4F6;
color:#111827;
">

<h1>Admin Dashboard</h1>

<p>Welcome, ${user.email}</p>

</div>


</div>

`;

});
