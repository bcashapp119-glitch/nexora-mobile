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


/* TEST */
alert("Nexora admin.js is connected!");


/* FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyDHwh66V6cT7nqEP9R7Iy827vbtBjQGeIA",
  authDomain: "nexora-mobile-af02f.firebaseapp.com",
  projectId: "nexora-mobile-af02f",
  storageBucket: "nexora-mobile-af02f.firebasestorage.app",
  messagingSenderId: "498265618137",
  appId: "1:498265618137:web:a1ffebae8eda0b88abf0c8",
  measurementId: "G-8494CNWZKL"
};


/* START FIREBASE */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


/* PAGE */
const appDiv = document.getElementById("app");


function showDashboard(user) {

  appDiv.innerHTML = `
    <h1>Nexora Admin</h1>

    <div class="card">
      <h2>Admin Dashboard</h2>
      <p>Welcome to Nexora Mobile Admin.</p>
      <p><strong>Signed in:</strong> ${user.email || "Admin"}</p>
    </div>

    <div class="card">
      <h2>Users</h2>
      <button id="usersButton">View Users</button>
      <div id="usersArea"></div>
    </div>

    <div class="card">
      <h2>Transactions</h2>
      <button id="transactionsButton">View Transactions</button>
      <div id="transactionsArea"></div>
    </div>

    <div class="card">
      <button id="logoutButton">Logout</button>
    </div>
  `;


  document
    .getElementById("usersButton")
    .addEventListener("click", loadUsers);


  document
    .getElementById("transactionsButton")
    .addEventListener("click", loadTransactions);


  document
    .getElementById("logoutButton")
    .addEventListener("click", async () => {
      await auth.signOut();
      location.reload();
    });
}


/* LOAD USERS */
async function loadUsers() {

  const area = document.getElementById("usersArea");

  area.innerHTML = "<p>Loading users...</p>";

  try {

    const snapshot = await getDocs(
      collection(db, "users")
    );

    if (snapshot.empty) {
      area.innerHTML = "<p>No users found.</p>";
      return;
    }

    area.innerHTML = "";

    snapshot.forEach((userDoc) => {

      const user = userDoc.data();

      const card = document.createElement("div");

      card.className = "card";

      card.innerHTML = `
        <h3>${user.name || user.fullName || "User"}</h3>

        <p>
          <strong>Email:</strong>
          ${user.email || "Not available"}
        </p>

        <p>
          <strong>Phone:</strong>
          ${user.phone || "Not available"}
        </p>

        <p>
          <strong>Balance:</strong>
          ₦${Number(user.balance || 0).toLocaleString()}
        </p>

        <button class="viewButton">
          View
        </button>

        <div class="details" style="display:none;"></div>
      `;


      const viewButton =
        card.querySelector(".viewButton");

      const details =
        card.querySelector(".details");


      viewButton.addEventListener("click", () => {

        if (details.style.display === "none") {

          details.style.display = "block";

          details.innerHTML = `
            <hr>

            <p>
              <strong>User ID:</strong>
              ${userDoc.id}
            </p>

            <p>
              <strong>Name:</strong>
              ${user.name || user.fullName || "Not available"}
            </p>

            <p>
              <strong>Email:</strong>
              ${user.email || "Not available"}
            </p>

            <p>
              <strong>Phone:</strong>
              ${user.phone || "Not available"}
            </p>
          `;

          viewButton.textContent = "Hide";

        } else {

          details.style.display = "none";

          viewButton.textContent = "View";
        }

      });


      area.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    area.innerHTML = `
      <p>Unable to load users.</p>
      <small>${error.message}</small>
    `;

  }

}


/* LOAD TRANSACTIONS */
async function loadTransactions() {

  const area =
    document.getElementById("transactionsArea");

  area.innerHTML =
    "<p>Loading transactions...</p>";

  try {

    const snapshot = await getDocs(
      collection(db, "transactions")
    );

    if (snapshot.empty) {

      area.innerHTML =
        "<p>No transactions found.</p>";

      return;
    }

    area.innerHTML = "";

    snapshot.forEach((transactionDoc) => {

      const transaction =
        transactionDoc.data();

      const card =
        document.createElement("div");

      card.className = "card";

      card.innerHTML = `
        <h3>
          ${transaction.type || "Transaction"}
        </h3>

        <p>
          <strong>Amount:</strong>
          ₦${Number(transaction.amount || 0).toLocaleString()}
        </p>

        <p>
          <strong>Status:</strong>
          ${transaction.status || "Unknown"}
        </p>

        <button class="viewTransaction">
          View
        </button>

        <div
          class="transactionDetails"
          style="display:none;"
        ></div>
      `;


      const button =
        card.querySelector(".viewTransaction");

      const details =
        card.querySelector(".transactionDetails");


      button.addEventListener("click", () => {

        if (details.style.display === "none") {

          details.style.display = "block";

          details.innerHTML = `
            <hr>

            <p>
              <strong>Transaction ID:</strong>
              ${transactionDoc.id}
            </p>

            <p>
              <strong>User ID:</strong>
              ${transaction.userId || "Not available"}
            </p>

            <p>
              <strong>Phone:</strong>
              ${transaction.phone || "Not available"}
            </p>

            <p>
              <strong>Network:</strong>
              ${transaction.network || "Not available"}
            </p>
          `;

          button.textContent = "Hide";

        } else {

          details.style.display = "none";

          button.textContent = "View";

        }

      });


      area.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    area.innerHTML = `
      <p>Unable to load transactions.</p>
      <small>${error.message}</small>
    `;

  }

}


/* CHECK LOGIN */
onAuthStateChanged(auth, (user) => {

  if (!user) {

    appDiv.innerHTML = `
      <div class="card">

        <h2>Admin Login Required</h2>

        <p>
          Please sign in with your Nexora admin account.
        </p>

      </div>
    `;

    return;
  }


  showDashboard(user);

});