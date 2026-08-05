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

const ADMIN_EMAIL = "sufiyanolawale36@gmail.com";


// ====================================
// HELPERS
// ====================================

function money(amount) {
  return "₦" + Number(amount || 0).toLocaleString("en-NG");
}


function safe(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function dateText(value) {

  if (!value) {
    return "—";
  }

  try {

    if (value.toDate) {
      return value.toDate().toLocaleString("en-NG");
    }

    return new Date(value).toLocaleString("en-NG");

  } catch {

    return "—";

  }
}


// ====================================
// AUTHENTICATION
// ====================================

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    appDiv.innerHTML = `
      <div class="card">
        <h1>Nexora Admin</h1>
        <p>Please login first.</p>
      </div>
    `;

    return;
  }


  if (user.email !== ADMIN_EMAIL) {

    appDiv.innerHTML = `
      <div class="card">
        <h1>Access Denied</h1>
        <p>This account is not authorized to access the admin dashboard.</p>
      </div>
    `;

    return;
  }


  await loadDashboard();

});


// ====================================
// DASHBOARD
// ====================================

async function loadDashboard() {

  appDiv.innerHTML = `

    <h1>Nexora Admin Dashboard</h1>

    <p>
      <strong>Admin:</strong>
      ${safe(ADMIN_EMAIL)}
    </p>

    <hr>

    <div id="stats">

      <div class="card">
        <h2>Loading dashboard...</h2>
        <p>Please wait.</p>
      </div>

    </div>


    <div class="card">

      <h2>Admin Controls</h2>

      <button id="usersBtn">
        👥 Users
      </button>

      <button id="transactionsBtn">
        📜 Transactions
      </button>

      <button id="refreshBtn">
        🔄 Refresh
      </button>

    </div>


    <div id="dashboardContent"></div>

  `;


  document
    .getElementById("usersBtn")
    .addEventListener("click", loadUsers);


  document
    .getElementById("transactionsBtn")
    .addEventListener("click", loadTransactions);


  document
    .getElementById("refreshBtn")
    .addEventListener("click", loadDashboard);


  await loadStats();

}


// ====================================
// STATISTICS
// ====================================

async function loadStats() {

  const statsDiv =
    document.getElementById("stats");


  try {

    const usersSnap =
      await getDocs(collection(db, "users"));


    const transactionsSnap =
      await getDocs(collection(db, "transactions"));


    let totalWallet = 0;

    usersSnap.forEach((userDoc) => {

      const user = userDoc.data();

      totalWallet += Number(
        user.wallet ??
        user.balance ??
        0
      );

    });


    let completed = 0;
    let pending = 0;


    transactionsSnap.forEach((transactionDoc) => {

      const transaction =
        transactionDoc.data();


      const status =
        String(transaction.status || "")
          .toLowerCase();


      if (status === "completed") {
        completed++;
      }


      if (status === "pending") {
        pending++;
      }

    });


    statsDiv.innerHTML = `

      <div class="card">
        <h2>👥 Total Users</h2>
        <p>${usersSnap.size}</p>
      </div>


      <div class="card">
        <h2>💰 Total Wallet Balance</h2>
        <p>${money(totalWallet)}</p>
      </div>


      <div class="card">
        <h2>📜 Transactions</h2>
        <p>${transactionsSnap.size}</p>
      </div>


      <div class="card">
        <h2>✅ Completed</h2>
        <p>${completed}</p>
      </div>


      <div class="card">
        <h2>⏳ Pending</h2>
        <p>${pending}</p>
      </div>

    `;


  } catch (error) {

    console.error(error);


    statsDiv.innerHTML = `

      <div class="card">

        <h2>Dashboard Error</h2>

        <p>
          ${safe(error.message)}
        </p>

      </div>

    `;

  }

}


// ====================================
// USERS
// ====================================

async function loadUsers() {

  const content =
    document.getElementById("dashboardContent");


  content.innerHTML = `

    <div class="card">

      <h2>👥 Users</h2>

      <p>Loading users...</p>

    </div>

  `;


  try {

    const snap =
      await getDocs(collection(db, "users"));


    if (snap.empty) {

      content.innerHTML = `

        <div class="card">

          <h2>👥 Users</h2>

          <p>No users found.</p>

        </div>

      `;

      return;

    }


    let html = `

      <div class="card">

        <h2>👥 Customer Accounts</h2>

        <input
          id="userSearch"
          type="text"
          placeholder="Search users..."
        >

      </div>


      <div id="userList">

    `;


    snap.forEach((userDoc) => {

      html += createUserCard(
        userDoc.id,
        userDoc.data()
      );

    });


    html += `</div>`;


    content.innerHTML = html;


    // SEARCH USERS

    const searchBox =
      document.getElementById("userSearch");


    searchBox.addEventListener(
      "input",
      () => {

        const search =
          searchBox.value.toLowerCase();


        document
          .querySelectorAll(".user-card")
          .forEach((card) => {

            const text =
              card.textContent.toLowerCase();


            card.style.display =
              text.includes(search)
                ? "block"
                : "none";

          });

      }
    );


    // VIEW USER BUTTONS

    document
      .querySelectorAll(".viewUserBtn")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const userId =
              button.dataset.userId;

            viewUser(userId);

          }
        );

      });


  } catch (error) {

    console.error(error);


    content.innerHTML = `

      <div class="card">

        <h2>Unable to load users</h2>

        <p>
          ${safe(error.message)}
        </p>

      </div>

    `;

  }

}


// ====================================
// USER CARD
// ====================================

function createUserCard(id, user) {

  const name =
    user.name ||
    user.fullName ||
    user.displayName ||
    "Unnamed User";


  const email =
    user.email ||
    "No email";


  const wallet =
    user.wallet ??
    user.balance ??
    0;


  const status =
    user.status ||
    "active";


  return `

    <div
      class="card user-card"
      data-user-id="${safe(id)}"
    >

      <h2>
        ${safe(name)}
      </h2>


      <p>
        <strong>Email:</strong>
        ${safe(email)}
      </p>


      <p>
        <strong>Wallet:</strong>
        ${money(wallet)}
      </p>


      <p>
        <strong>Status:</strong>
        ${safe(status)}
      </p>


      <button
        class="viewUserBtn"
        data-user-id="${safe(id)}"
      >
        View User
      </button>

    </div>

  `;

}


// ====================================
// VIEW USER
// ====================================

async function viewUser(userId) {

  const content =
    document.getElementById("dashboardContent");


  content.innerHTML = `

    <div class="card">

      <h2>👤 User Details</h2>

      <p>Loading user...</p>

    </div>

  `;


  try {

    const userRef =
      doc(db, "users", userId);


    const userSnap =
      await getDoc(userRef);


    if (!userSnap.exists()) {

      content.innerHTML = `

        <div class="card">

          <h2>User Not Found</h2>

          <p>
            This customer could not be found.
          </p>


          <button id="backUsersBtn">
            ← Back to Users
          </button>

        </div>

      `;


      document
        .getElementById("backUsersBtn")
        .addEventListener(
          "click",
          loadUsers
        );


      return;

    }


    const user =
      userSnap.data();


    const name =
      user.name ||
      user.fullName ||
      user.displayName ||
      "Unnamed User";


    const email =
      user.email ||
      "No email";


    const wallet =
      user.wallet ??
      user.balance ??
      0;


    const status =
      user.status ||
      "active";


    content.innerHTML = `

      <div class="card">

        <button id="backUsersBtn">
          ← Back to Users
        </button>


        <h2>
          👤 ${safe(name)}
        </h2>


        <p>
          <strong>Email:</strong>
          ${safe(email)}
        </p>


        <p>
          <strong>Wallet Balance:</strong>
          ${money(wallet)}
        </p>


        <p>
          <strong>Status:</strong>
          ${safe(status)}
        </p>


        <p>
          <strong>User ID:</strong>
          ${safe(userId)}
        </p>

      </div>

    `;


    document
      .getElementById("backUsersBtn")
      .addEventListener(
        "click",
        loadUsers
      );


  } catch (error) {

    console.error(error);


    content.innerHTML = `

      <div class="card">

        <h2>Unable to load user</h2>

        <p>
          ${safe(error.message)}
        </p>


        <button id="backUsersBtn">
          ← Back to Users
        </button>

      </div>

    `;


    document
      .getElementById("backUsersBtn")
      .addEventListener(
        "click",
        loadUsers
      );

  }

}


// ====================================
// TRANSACTIONS
// ====================================

async function loadTransactions() {

  const content =
    document.getElementById("dashboardContent");


  content.innerHTML = `

    <div class="card">

      <h2>📜 Transactions</h2>

      <p>Loading transactions...</p>

    </div>

  `;


  try {

    const snap =
      await getDocs(
        collection(db, "transactions")
      );


    if (snap.empty) {

      content.innerHTML = `

        <div class="card">

          <h2>📜 Transactions</h2>

          <p>
            No transactions yet.
          </p>

        </div>

      `;

      return;

    }


    let html = `

      <div class="card">

        <h2>
          📜 Transaction History
        </h2>


        <input
          id="transactionSearch"
          type="text"
          placeholder="Search transactions..."
        >


        <select id="transactionFilter">

          <option value="">
            All Services
          </option>

          <option value="airtime">
            Airtime
          </option>

          <option value="data">
            Data
          </option>

          <option value="esim">
            eSIM
          </option>

          <option value="epin">
            ePIN
          </option>

          <option value="wallet">
            Wallet
          </option>

        </select>

      </div>


      <div id="transactionList">

    `;


    snap.forEach((transactionDoc) => {

      html += createTransactionCard(
        transactionDoc.id,
        transactionDoc.data()
      );

    });


    html += `</div>`;


    content.innerHTML = html;


    const searchInput =
      document.getElementById(
        "transactionSearch"
      );


    const filter =
      document.getElementById(
        "transactionFilter"
      );


    function filterTransactions() {

      const search =
        searchInput.value.toLowerCase();


      const selected =
        filter.value.toLowerCase();


      document
        .querySelectorAll(".transaction-card")
        .forEach((card) => {

          const text =
            card.textContent.toLowerCase();


          const type =
            card.dataset.type || "";


          const searchMatch =
            text.includes(search);


          const typeMatch =
            !selected ||
            type.includes(selected);


          card.style.display =
            searchMatch && typeMatch
              ? "block"
              : "none";

        });

    }


    searchInput.addEventListener(
      "input",
      filterTransactions
    );


    filter.addEventListener(
      "change",
      filterTransactions
    );


  } catch (error) {

    console.error(error);


    content.innerHTML = `

      <div class="card">

        <h2>Transaction Error</h2>

        <p>
          ${safe(error.message)}
        </p>

      </div>

    `;

  }

}


// ====================================
// TRANSACTION CARD
// ====================================

function createTransactionCard(id, transaction) {

  const type =
    transaction.type ||
    "Transaction";


  const amount =
    transaction.amount ||
    0;


  const status =
    transaction.status ||
    "unknown";


  const network =
    transaction.network ||
    "";


  const phone =
    transaction.phone ||
    "";


  const userEmail =
    transaction.email ||
    transaction.userEmail ||
    "";


  return `

    <div
      class="card transaction-card"
      data-type="${safe(type.toLowerCase())}"
    >

      <h3>
        ${safe(type)}
      </h3>


      <p>
        <strong>Transaction ID:</strong>
        ${safe(id)}
      </p>


      <p>
        <strong>Amount:</strong>
        ${money(amount)}
      </p>


      <p>
        <strong>Status:</strong>
        ${safe(status)}
      </p>


      ${
        network
          ? `
            <p>
              <strong>Network:</strong>
              ${safe(network)}
            </p>
          `
          : ""
      }


      ${
        phone
          ? `
            <p>
              <strong>Phone:</strong>
              ${safe(phone)}
            </p>
          `
          : ""
      }


      ${
        userEmail
          ? `
            <p>
              <strong>User:</strong>
              ${safe(userEmail)}
            </p>
          `
          : ""
      }


      <p>
        <strong>Date:</strong>
        ${dateText(
          transaction.createdAt ||
          transaction.date
        )}
      </p>

    </div>

  `;

}