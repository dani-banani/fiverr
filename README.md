<<<<<<< HEAD
# Decentralized Freelance Escrow MVP

## 1. Project Overview
A Web3-enabled freelance marketplace (similar to Fiverr) designed to eliminate non-payment scams and undelivered work. The platform utilizes a Hybrid Web2/Web3 architecture, blending a traditional backend database for fast data retrieval with an Ethereum-compatible smart contract for trustless financial escrow and dispute resolution.

## 2. System Architecture & Tech Stack

* **Frontend:** React (Interacts with smart contracts via `ethers.js` or `viem`).
* **Backend/Database (Off-Chain):** Node.js/Spring Boot with a traditional SQL/NoSQL database. Stores heavy transactional metadata (Job Titles, Due Dates, Descriptions, Chat logs).
* **Blockchain (On-Chain):** Solidity Smart Contract. Acts strictly as an escrow state machine. Stores only the `jobId`, wallet addresses, state enum, and funds.

## 3. Core Workflows (State Machine)

### Flow A: Job Creation & Escrow Lock
1. **Client Request:** Client creates a job offer (title, description, due date) on the frontend.
2. **Off-Chain Storage:** The backend saves this data and generates a unique `jobId` (UUID).
3. **On-Chain Escrow:** The freelancer accepts the offer. The frontend prompts the Client's wallet to deposit the agreed cryptocurrency into the Smart Contract, mapped to the `jobId`.
4. **State Change:** The contract state for this job becomes `FUNDED`. The funds are securely locked; neither party can withdraw them directly.

### Flow B: Submission & Payout
1. **Work Delivery:** The freelancer submits the final work deliverables off-chain via the platform.
2. **Submission Flag:** The freelancer triggers an on-chain transaction to change the job state to `SUBMITTED`.
3. **Client Review:**
   * **Scenario 1 (Approval):** The client approves the work. They sign a transaction releasing the funds. The smart contract instantly transfers the escrowed amount to the freelancer.
   * **Scenario 2 (Auto-Release):** If the client ghosts and fails to review the work within a set timeframe (e.g., 7 days), the freelancer can trigger a timeout function to claim the funds instantly.
   * **Scenario 3 (Rejection):** The client rejects the work, moving the state to `DISPUTED`.

### Flow C: Dispute Resolution (Admin Arbitration)
1. **Dispute Trigger:** The client flags the delivery as inadequate/scam, locking the funds in the `DISPUTED` state.
2. **Admin Review:** Trusted platform administrators review the off-chain chat logs, the initial job requirements, and the delivered work.
3. **Arbitration Execution:** An admin wallet with `onlyAdmin` privileges calls the contract's resolution function:
   * `resolveDispute(jobId, freelancerWins = true)`: Funds are transferred to the freelancer.
   * `resolveDispute(jobId, freelancerWins = false)`: Funds are refunded to the client.

## 4. Smart Contract Interface (Draft)

The smart contract must expose the following core functions to the frontend/backend agents:

```solidity
// Payable function. Called by the client to lock funds.
function createEscrow(string jobId, address freelancer) external payable;

// Called by the freelancer to flag completion. Starts the auto-release timer.
function submitWork(string jobId) external;

// Called by the client to release funds to the freelancer.
function approveAndPay(string jobId) external;

// Called by the freelancer if the client ignores the submission past the deadline.
function claimTimeout(string jobId) external;

// Called by the client to halt auto-release and call for admin review.
function raiseDispute(string jobId) external;

// Called ONLY by the platform admin wallet to finalize a dispute.
function resolveDispute(string jobId, bool freelancerWins) external;
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 67dbd8ee0466f492cefa35c1f51526f3a5b63422
