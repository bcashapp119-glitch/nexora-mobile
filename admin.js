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
  getDoc
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

function loading(message = "Loading Nexora Admin...") {
  appDiv.innerHTML = `
    <div class="card">
      <h2>${message}</h2>
    </div>
  `;
}

function showError(message) {
  appDiv.innerHTML = `
    <div class="card">
      <h2>Something went wrong</h2>
      <p>${message}</p>
      <button onclick="location.reload()">Reload</button>
    </div>
  `;
}

function showDashboard(user) {
  appDiv.innerHTML = `
    <h1>Nexora Admin</h1>

    <div class="card">
      <h2>Admin Dashboard</h2>
      <p>Signed in as:</p>
      <strong>${user.email || "Admin"}</strong>
    </div>

    <div class="card">
      <h2>Users</h2>
      <button id="loadUsersBtn">View Users</button>
      <div id="usersArea"></div>
    </div>

    <div class="card">
      <h2>Transactions</h2>
      <button id="loadTransactionsBtn">View Transactions</button>
      <div id="transactionsArea"></div>
    </div>

    <div class="card">
      <button id="logoutBtn">Logout</button>
    </div>
  `;

  document
    .getElementById("loadUsersBtn")
    .addEventListener("click", loadUsers);

  document
    .getElementById("loadTransactionsBtn")
    .addEventListener("click", loadTransactions);

  document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {
      await auth.signOut();
      location.reload();
    });
}

async function loadUsers() {
  const area = document.getElementById("usersArea");

  area.innerHTML = "<p>Loading users...</p>";

  try {
    const snapshot = await getDocs(collection(db, "users"));

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
        <p><strong>Email:</strong> ${user.email || "Not available"}</p>
        <p><strong>Phone:</strong> ${user.phone || "Not available"}</p>
        <p><strong>Balance:</strong> ₦${Number(user.balance || 0).toLocaleString()}</p>

        <button class="viewUserBtn">
          View
        </button>

        <div class="userDetails" style="display:none;"></div>
      `;

      const viewButton = card.querySelector(".viewUserBtn");
      const details = card.querySelector(".userDetails");

      viewButton.addEventListener("click", async () => {
        if (details.style.display === "none") {
          details.style.display = "block";

          details.innerHTML = `
            <hr>
            <p><strong>User ID:</strong> ${userDoc.id}</p>
            <p><strong>Created:</strong> ${
              user.createdAt?.toDate
                ? user.createdAt.toDate().toLocaleString()
                : "Not available"
            }</p>
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

async function loadTransactions() {
  const area = document.getElementById("transactionsArea");

  area.innerHTML = "<p>Loading transactions...</p>";

  try {
    const snapshot = await getDocs(collection(db, "transactions"));

    if (snapshot.empty) {
      area.innerHTML = "<p>No transactions found.</p>";
      return;
    }

    area.innerHTML = "";

    snapshot.forEach((transactionDoc) => {
      const transaction = transactionDoc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${transaction.type || "Transaction"}</h3>

        <p>
          <strong>Amount:</strong>
          ₦${Number(transaction.amount || 0).toLocaleString()}
        </p>

        <p>
          <strong>Status:</strong>
          ${transaction.status || "Unknown"}
        </p>

        <button class="viewTransactionBtn">
          View
        </button>

        <div class="transactionDetails" style="display:none;"></div>
      `;

      const viewButton =
        card.querySelector(".viewTransactionBtn");

      const details =
        card.querySelector(".transactionDetails");

      viewButton.addEventListener("click", () => {
        if (details.style.display === "none") {
          details.style.display = "block";

          details.innerHTML = `
            <hr>
            <p><strong>Transaction ID:</strong> ${transactionDoc.id}</p>
            <p><strong>User ID:</strong> ${
              transaction.userId || "Not available"
            }</p>
            <p><strong>Network:</strong> ${
              transaction.network || "Not available"
            }</p>
            <p><strong>Phone:</strong> ${
              transaction.phone || "Not available"
            }</p>
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
      <p>Unable to load transactions.</p>
      <small>${error.message}</small>
    `;
  }
}

loading();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showError(
      "You are not signed in. Please sign in with your Nexora admin account."
    );
    return;
  }

  showDashboard(user);
});