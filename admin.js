import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


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


onAuthStateChanged(auth, (user)=>{


if(!user){

window.location.href="login.html";

return;

}


if(user.email !== "Sufiyanolawale36@gmail.com"){

document.getElementById("app").innerHTML = `
<h2 style="text-align:center;color:red;">
Access Denied
</h2>
`;

return;

}


// ADMIN DASHBOARD

document.getElementById("app").innerHTML = `

<h1>Welcome to Nexora Admin Dashboard</h1>

<p>Admin: ${user.email}</p>

<hr>

<h3>Users</h3>
<p>Manage Nexora users here</p>

<h3>Wallet</h3>
<p>Manage wallet transactions here</p>

<h3>Airtime / Data / eSIM</h3>
<p>Service management ready</p>

`;

});
