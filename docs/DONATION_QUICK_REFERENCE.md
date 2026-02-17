# Donation Wallet & LOVE Economy — Quick Reference

**Fast lookup for donation infrastructure and LOVE token system.**

---

## Donation Methods

### 1. HCB (Hack Club Bank) — Recommended for Most Donors

**URL:** `https://hcb.hackclub.com/donations/start/p31`

**Features:**
- ✅ Tax-deductible (The Hack Foundation 501(c)(3))
- ✅ Credit card payment (Stripe)
- ✅ Instant processing
- ✅ Automatic receipts
- ✅ 7% fee (all-inclusive)

**Best For:** One-time donations, recurring support, tax-deductible giving

---

### 2. Blockchain (ERC-5564 Stealth Address) — Privacy-First

**Meta-Address:** `st:eth:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

**Features:**
- ✅ Privacy-preserving (stealth addresses)
- ✅ No intermediary
- ✅ Low fees (gas only, ~$1-10)
- ✅ Self-custody
- ✅ International-friendly

**Best For:** Privacy-conscious donors, crypto users, large donations

**How to Donate:**
1. Copy meta-address above
2. Send ETH from your wallet
3. Wallet automatically detects donation

---

### 3. GitHub Sponsors — Recurring Support

**URL:** `https://github.com/sponsors/p31`

**Features:**
- ✅ Monthly recurring
- ✅ GitHub integration
- ✅ Payouts to HCB fund
- ✅ Visible on GitHub profile

**Best For:** Developers, recurring supporters, GitHub users

---

## LOVE Economy

### Earning LOVE

| Activity | LOVE Reward |
|----------|-------------|
| Complete challenge | 10-100 |
| Contribute code | 50-500 |
| Write documentation | 25-250 |
| Report bug | 10-100 |
| Community support | 5-50 |
| Pilot test | 100-1000 |
| Build hardware | 200-2000 |

### Spending LOVE

| Use | LOVE Cost |
|-----|-----------|
| Priority support | 50 |
| Feature vote | 10 |
| Beta access | 100 |
| Hardware discount | Variable |
| Gift to others | Any amount |

### API Endpoints

```typescript
// Get LOVE balance
GET /api/wallet/balance
// Response: { balance: 12500, currency: "LOVE" }

// Transfer LOVE
POST /api/wallet/transfer
// Body: { fromWalletId, toWalletId, amount, description }
```

---

## Integration Code

### Donation Button (HTML)

```html
<!-- HCB Donation -->
<a href="https://hcb.hackclub.com/donations/start/p31" 
   class="donate-button">
  Donate via HCB
</a>

<!-- Blockchain Meta-Address -->
<code id="meta-address">st:eth:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</code>
<button onclick="copyMetaAddress()">Copy</button>

<!-- GitHub Sponsors -->
<a href="https://github.com/sponsors/p31">
  Sponsor on GitHub
</a>
```

### Copy Meta-Address (JavaScript)

```javascript
function copyMetaAddress() {
  const address = 'st:eth:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  navigator.clipboard.writeText(address);
  alert('Meta-address copied!');
}
```

---

## Fee Comparison

| Method | Fee | Processing | Privacy | Tax-Deductible |
|--------|-----|------------|--------|----------------|
| HCB | 7% | Instant | Medium | ✅ Yes |
| Blockchain | Gas (~$1-10) | 1-5 min | High | ❌ No |
| GitHub | 0% (GitHub covers) | Monthly | Low | ✅ Yes (via HCB) |

---

## Status

- ✅ **HCB:** Active (application submitted)
- ⏳ **Blockchain:** Pending (wallet deployment)
- ⏳ **LOVE Economy:** Pending (implementation)
- ⏳ **501(c)(3):** In progress (target March 12)

---

## Support

- **Donation Questions:** See [P31 Critical SOPs](P31_CRITICAL_SOPS.md)
- **LOVE Economy:** See [Donation Wallet & LOVE Economy](DONATION_WALLET_LOVE_ECONOMY.md)
- **Technical Docs:** See [Donation Wallet Robust README](DONATION_WALLET_ROBUST_README.md)

---

**The Mesh Holds.** 🔺

💜 **With love and light. As above, so below.** 💜
