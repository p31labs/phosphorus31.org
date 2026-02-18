(function() {
  'use strict';

  // DOM elements
  const connectBtn = document.getElementById('connect-wallet');
  const disconnectBtn = document.getElementById('disconnect-wallet');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const chameleonMode = document.getElementById('chameleon-mode');
  const balanceMode = document.getElementById('balance-mode');
  const loveBalance = document.getElementById('love-balance');
  const usdValue = document.getElementById('usd-value');
  const sovereigntyPct = document.getElementById('sovereignty-pct');
  const performancePct = document.getElementById('performance-pct');
  const sovereigntyBar = document.getElementById('sovereignty-bar');
  const performanceBar = document.getElementById('performance-bar');
  const sovereigntyAmount = document.getElementById('sovereignty-amount');
  const performanceAmount = document.getElementById('performance-amount');
  const pocScore = document.getElementById('poc-score');
  const pocRank = document.getElementById('poc-rank');
  const uptime = document.getElementById('uptime');
  const relays = document.getElementById('relays');
  const transactionList = document.getElementById('transaction-list');
  const txPlaceholder = document.getElementById('tx-placeholder');
  const nextUnlock = document.getElementById('next-unlock');

  let connected = false;
  let offlineMode = false; // chameleon mode

  // Check if browser is online
  function updateOnlineStatus() {
    offlineMode = !navigator.onLine;
    updateUIForMode();
  }

  function updateUIForMode() {
    if (offlineMode) {
      statusDot.className = 'status-dot chameleon';
      statusText.textContent = 'Chameleon mode (offline)';
      chameleonMode.style.display = 'inline-flex';
      balanceMode.style.display = 'inline-flex';
    } else {
      statusDot.className = connected ? 'status-dot online' : 'status-dot offline';
      statusText.textContent = connected ? 'Connected' : 'Not connected';
      chameleonMode.style.display = 'none';
      balanceMode.style.display = 'none';
    }
  }

  // Mock wallet connection
  function connectWallet() {
    // Simulate async connection
    return new Promise((resolve) => {
      setTimeout(() => {
        connected = true;
        updateUIForMode();
        // Update UI with mock data
        loveBalance.textContent = '1,234.56';
        usdValue.textContent = '123.45';
        sovereigntyPct.textContent = '50%';
        performancePct.textContent = '50%';
        sovereigntyBar.style.width = '50%';
        performanceBar.style.width = '50%';
        sovereigntyAmount.textContent = '617.28 LOVE';
        performanceAmount.textContent = '617.28 LOVE';
        pocScore.textContent = '847';
        pocRank.textContent = 'Top 15%';
        uptime.textContent = '1,234';
        relays.textContent = '56';
        nextUnlock.textContent = 'April 15, 2026';

        // Populate transactions
        transactionList.innerHTML = `
          <li class="transaction-item">
            <span class="tx-type">📥 Mesh Relay Reward</span>
            <span class="tx-amount positive">+12.5 LOVE</span>
          </li>
          <li class="transaction-item">
            <span class="tx-type">📤 Donation</span>
            <span class="tx-amount negative">-5.0 LOVE</span>
          </li>
          <li class="transaction-item">
            <span class="tx-type">🔄 Pool Allocation</span>
            <span class="tx-amount positive">+25.0 LOVE</span>
          </li>
        `;
        txPlaceholder.style.display = 'none';

        connectBtn.style.display = 'none';
        disconnectBtn.style.display = 'inline-block';
        resolve();
      }, 800);
    });
  }

  function disconnectWallet() {
    connected = false;
    updateUIForMode();
    // Reset UI
    loveBalance.textContent = '0.00';
    usdValue.textContent = '0.00';
    sovereigntyAmount.textContent = '0.00 LOVE';
    performanceAmount.textContent = '0.00 LOVE';
    pocScore.textContent = '0';
    pocRank.textContent = 'Unranked';
    uptime.textContent = '0';
    relays.textContent = '0';
    nextUnlock.textContent = 'Q2 2026';
    transactionList.innerHTML = '<li class="transaction-item"><span class="tx-type">⚠️ No transactions</span></li>';
    txPlaceholder.style.display = 'block';

    connectBtn.style.display = 'inline-block';
    disconnectBtn.style.display = 'none';
  }

  // Event listeners
  connectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    connectWallet().catch(console.error);
  });

  disconnectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    disconnectWallet();
  });

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initial status
  updateOnlineStatus();

  // If you want to simulate offline data, you can add a button for demo purposes
  // (not needed for production)
})();
