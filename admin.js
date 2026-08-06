import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
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


function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function showDashboard(user) {

  appDiv.innerHTML = `
    <h1>Nexora Admin</h1>

    <div class="card">
      <h2>Admin Dashboard</h2>
      <p>Welcome to Nexora Mobile Admin.</p>

      <p>
        <strong>Signed in:</strong>
        ${escapeHTML(user.email || "Admin")}
      </p>
    </div>

    <div class="card">
      <h2>Users</h2>

      <button id="usersButton">
        View Users
      </button>

      <div id="usersArea"></div>
    </div>

    <div class="card">
      <h2>Transactions</h2>

      <button id="transactionsButton">
        View Transactions
      </button>

      <div id="transactionsArea"></div>
    </div>

    <div class="card">
      <button id="logoutButton">
        Logout
      </button>
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


/* =========================
   LOAD USERS
========================= */

async function loadUsers() {

  const area =
    document.getElementById("usersArea");

  area.innerHTML =
    "<p>Loading customers...</p>";


  try {

    const snapshot =
      await getDocs(
        collection(db, "users")
      );


    if (snapshot.empty) {

      area.innerHTML =
        "<p>No customers found.</p>";

      return;
    }


    area.innerHTML = "";


    snapshot.forEach((userDoc) => {

      const user = userDoc.data();

      const name =
        user.name ||
        user.fullName ||
        "User";

      const email =
        user.email ||
        "Not available";

      const phone =
        user.phone ||
        "Not available";

      const balance =
        Number(user.balance || 0);


      const card =
        document.createElement("div");

      card.className = "card";


      card.innerHTML = `

        <h3>
          ${escapeHTML(name)}
        </h3>

        <p>
          <strong>Email:</strong>
          ${escapeHTML(email)}
        </p>

        <p>
          <strong>Phone:</strong>
          ${escapeHTML(phone)}
        </p>

        <p>
          <strong>Wallet Balance:</strong>
          ₦<span class="balance">
            ${balance.toLocaleString()}
          </span>
        </p>


        <input
          class="walletAmount"
          type="number"
          min="1"
          step="1"
          placeholder="Enter amount"
        />


        <button class="addFundsButton">
          Add Funds
        </button>


        <button class="deductFundsButton">
          Deduct Funds
        </button>


        <br>


        <button class="viewUserButton">
          View Customer
        </button>


        <div
          class="customerDetails"
          style="display:none;"
        ></div>

      `;


      const balanceElement =
        card.querySelector(".balance");


      const amountInput =
        card.querySelector(".walletAmount");


      const addButton =
        card.querySelector(
          ".addFundsButton"
        );


      const deductButton =
        card.querySelector(
          ".deductFundsButton"
        );


      const viewButton =
        card.querySelector(
          ".viewUserButton"
        );


      const details =
        card.querySelector(
          ".customerDetails"
        );


      /* ADD FUNDS */

      addButton.addEventListener(
        "click",
        async () => {

          const amount =
            Number(amountInput.value);


          if (
            !Number.isFinite(amount) ||
            amount <= 0
          ) {

            alert(
              "Please enter a valid amount."
            );

            return;
          }


          const confirmed =
            confirm(
              `Add ₦${amount.toLocaleString()} to this customer's wallet?`
            );


          if (!confirmed) return;


          addButton.disabled = true;

          addButton.textContent =
            "Adding...";


          try {

            const newBalance =
              balance +
              amount;


            await updateDoc(
              doc(
                db,
                "users",
                userDoc.id
              ),
              {
                balance: newBalance
              }
            );


            await addDoc(
              collection(
                db,
                "transactions"
              ),
              {
                userId: userDoc.id,
                type: "Admin Wallet Credit",
                amount: amount,
                status: "Successful",
                direction: "credit",
                createdAt:
                  serverTimestamp()
              }
            );


            balanceElement.textContent =
              newBalance.toLocaleString();


            amountInput.value = "";


            alert(
              `₦${amount.toLocaleString()} added successfully.`
            );


          } catch (error) {

            console.error(error);

            alert(
              "Unable to add funds: " +
              error.message
            );

          }


          addButton.disabled = false;

          addButton.textContent =
            "Add Funds";

        }
      );


      /* DEDUCT FUNDS */

      deductButton.addEventListener(
        "click",
        async () => {

          const amount =
            Number(amountInput.value);


          if (
            !Number.isFinite(amount) ||
            amount <= 0
          ) {

            alert(
              "Please enter a valid amount."
            );

            return;
          }


          if (amount > balance) {

            alert(
              "This customer does not have enough wallet balance."
            );

            return;
          }


          const confirmed =
            confirm(
              `Deduct ₦${amount.toLocaleString()} from this customer's wallet?`
            );


          if (!confirmed) return;


          deductButton.disabled = true;

          deductButton.textContent =
            "Deducting...";


          try {

            const newBalance =
              balance -
              amount;


            await updateDoc(
              doc(
                db,
                "users",
                userDoc.id
              ),
              {
                balance: newBalance
              }
            );


            await addDoc(
              collection(
                db,
                "transactions"
              ),
              {
                userId: userDoc.id,
                type: "Admin Wallet Debit",
                amount: amount,
                status: "Successful",
                direction: "debit",
                createdAt:
                  serverTimestamp()
              }
            );


            balanceElement.textContent =
              newBalance.toLocaleString();


            amountInput.value = "";


            alert(
              `₦${amount.toLocaleString()} deducted successfully.`
            );


          } catch (error) {

            console.error(error);

            alert(
              "Unable to deduct funds: " +
              error.message
            );

          }


          deductButton.disabled = false;

          deductButton.textContent =
            "Deduct Funds";

        }
      );


      /* VIEW CUSTOMER */

      viewButton.addEventListener(
        "click",
        async () => {

          if (
            details.style.display ===
            "none"
          ) {

            details.style.display =
              "block";

            viewButton.disabled =
              true;

            viewButton.textContent =
              "Loading...";


            await showCustomerDetails(
              details,
              userDoc.id,
              user
            );


            viewButton.disabled =
              false;

            viewButton.textContent =
              "Hide Customer";

          } else {

            details.style.display =
              "none";

            viewButton.textContent =
              "View Customer";

          }

        }
      );


      area.appendChild(card);

    });


  } catch (error) {

    console.error(error);

    area.innerHTML = `
      <p>
        Unable to load customers.
      </p>

      <small>
        ${escapeHTML(error.message)}
      </small>
    `;

  }
}


/* =========================
   CUSTOMER DETAILS
========================= */

async function showCustomerDetails(
  details,
  userId,
  user
) {

  details.innerHTML = `

    <hr>

    <h3>
      Customer Details
    </h3>

    <p>
      <strong>User ID:</strong>
      ${escapeHTML(userId)}
    </p>

    <p>
      <strong>Name:</strong>
      ${escapeHTML(
        user.name ||
        user.fullName ||
        "Not available"
      )}
    </p>

    <p>
      <strong>Email:</strong>
      ${escapeHTML(
        user.email ||
        "Not available"
      )}
    </p>

    <p>
      <strong>Phone:</strong>
      ${escapeHTML(
        user.phone ||
        "Not available"
      )}
    </p>

    <p>
      <strong>Wallet:</strong>
      ₦${Number(
        user.balance || 0
      ).toLocaleString()}
    </p>

    <hr>

    <h3>
      Customer Transactions
    </h3>

    <div id="customerTransactions">
      Loading transactions...
    </div>

  `;


  const transactionArea =
    details.querySelector(
      "#customerTransactions"
    );


  try {

    const transactionSnapshot =
      await getDocs(
        query(
          collection(
            db,
            "transactions"
          ),
          where(
            "userId",
            "==",
            userId
          )
        )
      );


    if (
      transactionSnapshot.empty
    ) {

      transactionArea.innerHTML =
        "<p>No transactions found.</p>";

      return;
    }


    transactionArea.innerHTML = "";


    transactionSnapshot.forEach(
      (transactionDoc) => {

        const transaction =
          transactionDoc.data();


        const transactionCard =
          document.createElement("div");


        transactionCard.className =
          "card";


        transactionCard.innerHTML = `

          <h4>
            ${escapeHTML(
              transaction.type ||
              "Transaction"
            )}
          </h4>

          <p>
            <strong>Amount:</strong>
            ₦${Number(
              transaction.amount || 0
            ).toLocaleString()}
          </p>

          <p>
            <strong>Status:</strong>
            ${escapeHTML(
              transaction.status ||
              "Unknown"
            )}
          </p>

          <p>
            <strong>Transaction ID:</strong>
            ${escapeHTML(
              transactionDoc.id
            )}
          </p>

        `;


        transactionArea.appendChild(
          transactionCard
        );

      }
    );


  } catch (error) {

    console.error(error);

    transactionArea.innerHTML = `
      <p>
        Could not load transactions.
      </p>

      <small>
        ${escapeHTML(error.message)}
      </small>
    `;

  }
}


/* =========================
   ALL TRANSACTIONS
========================= */

async function loadTransactions() {

  const area =
    document.getElementById(
      "transactionsArea"
    );


  area.innerHTML =
    "<p>Loading transactions...</p>";


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "transactions"
        )
      );


    if (snapshot.empty) {

      area.innerHTML =
        "<p>No transactions found.</p>";

      return;
    }


    area.innerHTML = "";


    snapshot.forEach(
      (transactionDoc) => {

        const transaction =
          transactionDoc.data();


        const card =
          document.createElement("div");


        card.className =
          "card";


        card.innerHTML = `

          <h3>
            ${escapeHTML(
              transaction.type ||
              "Transaction"
            )}
          </h3>

          <p>
            <strong>Amount:</strong>
            ₦${Number(
              transaction.amount || 0
            ).toLocaleString()}
          </p>

          <p>
            <strong>Status:</strong>
            ${escapeHTML(
              transaction.status ||
              "Unknown"
            )}
          </p>

          <button class="viewTransactionButton">
            View Details
          </button>

          <div
            class="transactionDetails"
            style="display:none;"
          ></div>

        `;


        const button =
          card.querySelector(
            ".viewTransactionButton"
          );


        const details =
          card.querySelector(
            ".transactionDetails"
          );


        button.addEventListener(
          "click",
          () => {

            if (
              details.style.display ===
              "none"
            ) {

              details.style.display =
                "block";


              details.innerHTML = `

                <hr>

                <p>
                  <strong>
                    Transaction ID:
                  </strong>

                  ${escapeHTML(
                    transactionDoc.id
                  )}
                </p>

                <p>
                  <strong>
                    User ID:
                  </strong>

                  ${escapeHTML(
                    transaction.userId ||
                    "Not available"
                  )}
                </p>

                <p>
                  <strong>
                    Phone:
                  </strong>

                  ${escapeHTML(
                    transaction.phone ||
                    "Not available"
                  )}
                </p>

                <p>
                  <strong>
                    Network:
                  </strong>

                  ${escapeHTML(
                    transaction.network ||
                    "Not available"
                  )}
                </p>

              `;


              button.textContent =
                "Hide Details";

            } else {

              details.style.display =
                "none";

              button.textContent =
                "View Details";

            }

          }
        );


        area.appendChild(card);

      }
    );


  } catch (error) {

    console.error(error);

    area.innerHTML = `
      <p>
        Unable to load transactions.
      </p>

      <small>
        ${escapeHTML(error.message)}
      </small>
    `;

  }
}


/* =========================
   ADMIN AUTH
========================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (!user) {

      appDiv.innerHTML = `
        <div class="card">

          <h2>
            Admin Login Required
          </h2>

          <p>
            Please sign in with your
            Nexora admin account.
          </p>

        </div>
      `;

      return;
    }


    showDashboard(user);

  }
);