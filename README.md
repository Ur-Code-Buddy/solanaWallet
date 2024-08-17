# Solana Crypto Wallet

Welcome to the Solana Crypto Wallet! This is a secure, feature-rich wallet application built on the Solana blockchain, allowing you to manage multiple wallets, send/receive funds, and verify transactions directly on the blockchain. 

## Features

- **Create Multiple Wallets:** Generate as many wallets as you need, all linked to a single mnemonic phrase for easy management.
- **Send and Receive SOL:** Transfer funds effortlessly between wallets on the Solana network.
- **View Balances:** Check the balance of each wallet in real-time.
- **Verify Transactions:** Confirm and track your transactions directly on the Solana blockchain.
- **Secure:** No data is stored. Your mnemonic phrase and private keys are never sent to any server, ensuring complete safety.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A web browser (Chrome, Firefox, etc.)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ur-Code-Buddy/solanaWallet.git
   cd solana-crypto-wallet
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview the production build locally:**

   ```bash
   npm run preview
   ```

### Usage

1. **Sign In:**
   - On the homepage, generate a mnemonic phrase or enter your existing one.
   - The mnemonic phrase is securely stored in your browser's local storage (optional).

2. **Manage Wallets:**
   - After signing in, you can create multiple wallets. All wallets are derived from the same mnemonic phrase.

3. **Send/Receive SOL:**
   - Easily send SOL to other wallets by entering the recipient's public key and the amount.
   - Receive SOL by sharing your wallet's public key.

4. **View Balances:**
   - Check your wallet's balance in real-time from the dashboard.

5. **Verify Transactions:**
   - All transactions are recorded on the Solana blockchain, ensuring transparency and security.

### Security

- **No Data Storage:** We do not store any mnemonic phrases, private keys, or other sensitive information on any server. Everything is managed locally in your browser.
- **Client-Side Encryption:** Your mnemonic phrase and private keys are kept safe through client-side encryption and are never exposed to the network.

### Demo

Check out the live demo here: [Solana Crypto Wallet](https://solanawallet.baivabprojects.site/)

## Contributing

We welcome contributions! Please fork this repository and submit pull requests if you have any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to @kirat_tw for guidance and support.
- Powered by the Solana blockchain.

---

Happy coding! 🚀
