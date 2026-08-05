document.getElementById("app").innerHTML = `

<div class="admin-container">

  <aside class="sidebar">
    <h2>NEXORA</h2>
    <p class="admin-title">ADMIN PANEL</p>

    <nav>
      <a>🏠 Dashboard</a>
      <a>👥 Users</a>
      <a>💳 Wallet</a>
      <a>📱 Airtime</a>
      <a>📶 Data</a>
      <a>🌍 eSIM</a>
      <a>📜 Transactions</a>
      <a>⚙ Settings</a>
    </nav>
  </aside>


  <main class="dashboard">

    <h1>Welcome to Nexora Admin Dashboard</h1>
    <p class="subtitle">Administrator Control Center</p>


    <div class="cards">

      <div class="card">
        <h3>Users</h3>
        <p>0 Registered Users</p>
      </div>

      <div class="card">
        <h3>Wallet</h3>
        <p>₦0 Balance</p>
      </div>

      <div class="card">
        <h3>Transactions</h3>
        <p>0 Transactions</p>
      </div>

      <div class="card">
        <h3>eSIM</h3>
        <p>Management Ready</p>
      </div>

    </div>


    <section class="panel">
      <h2>System Status</h2>
      <p>✅ Nexora Admin System Online</p>
      <p>✅ Database Connected</p>
      <p>✅ Services Ready</p>
    </section>


  </main>

</div>

`;
