# Fundora Smart Contracts & Onchain Architecture

> Official technical specification and deployed contract directory for the Fundora Protocol on Arc Network.

---

## 1. Protocol Architecture

Fundora is a non-custodial capital allocation protocol built on the **Arc Network**, leveraging native **USDC** for gas fees and escrow settlements. The protocol consists of three core contracts:

```
┌─────────────────────────────────────────────────────────────────┐
│                        AdminRegistry                            │
│  - Sybil-resistant organizer registry                          │
│  - Verifiable onchain profiles (Arc House username & org info)  │
│  - Anti-spam registration fee in native USDC                    │
└────────────────────────────────┬────────────────────────────────┘
                                 │ verifies organizer
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FundoraEvents                            │
│  - Multi-track hackathons, bounties, and contest escrow         │
│  - Native USDC escrow vault with pre-funded prize guarantees    │
│  - Weighted rubric reviewer scorecards & deliberation           │
│  - Pull-payment winner reward claim mechanism                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Fundora (Core)                           │
│  - Milestone-gated 1-to-1 microgrant lifecycle                  │
│  - Milestone evidence hashing (keccak256 anchored onchain)      │
│  - Quorum-based reviewer voting threshold                       │
│  - Pull-payment builder claims & unspent funder refund escrow   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Deployed Contract Directory

### Arc Mainnet (Chain ID: `5042`)

| Contract | Address | Verification Status | Explorer |
| :--- | :--- | :--- | :--- |
| **FundoraEvents** | `0xa8353b078a258cd9caacc618b1fe1404666b9525` | Deployed & Active | [View on Arcscan](https://explorer.mainnet.arc.io/address/0xa8353b078a258cd9caacc618b1fe1404666b9525) |
| **AdminRegistry** | `0xc57dbdb09123a6b648dc6d4bdf0e5ebf510b0ee1` | Deployed & Active | [View on Arcscan](https://explorer.mainnet.arc.io/address/0xc57dbdb09123a6b648dc6d4bdf0e5ebf510b0ee1) |
| **Fundora (Grants)** | `0x371b4b6894882082e706cd84b781bf749472a602` | Deployed & Active | [View on Arcscan](https://explorer.mainnet.arc.io/address/0x371b4b6894882082e706cd84b781bf749472a602) |
| **USDC (Gas & Token)** | `0x3600000000000000000000000000000000000000` | Native Precompile | [View on Arcscan](https://explorer.mainnet.arc.io/address/0x3600000000000000000000000000000000000000) |

### Arc Testnet (Chain ID: `5042002`)

| Contract | Address | Verification Status | Explorer |
| :--- | :--- | :--- | :--- |
| **FundoraEvents** | `0xc9c7033f4736f8b6e213ea7617596c3fd7bb154a` | Deployed & Active | [View on Arcscan](https://explorer.testnet.arc.io/address/0xc9c7033f4736f8b6e213ea7617596c3fd7bb154a) |
| **AdminRegistry** | `0x9bf7d4681410f7db14490cc67d517e3621d73fe6` | Deployed & Active | [View on Arcscan](https://explorer.testnet.arc.io/address/0x9bf7d4681410f7db14490cc67d517e3621d73fe6) |
| **Fundora (Grants)** | `0xef34036dda3960a1cd57b1368329bfcf29700259` | Deployed & Active | [View on Arcscan](https://explorer.testnet.arc.io/address/0xef34036dda3960a1cd57b1368329bfcf29700259) |
| **USDC (Gas & Token)** | `0x3600000000000000000000000000000000000000` | Native Precompile | [View on Arcscan](https://explorer.testnet.arc.io/address/0x3600000000000000000000000000000000000000) |

---

## 3. Core Contract Specifications

### 3.1 FundoraEvents (`FundoraEvents.sol`)
Manages multi-participant competitive events (hackathons, bounties, and contests):
- **Pre-Funded Escrow Vault**: Organizers deposit USDC upfront into the escrow contract. The total prize pool is locked and verifiable by participants.
- **Dual Modality Support**:
  - `EventType.NativeEscrow (0)`: Full onchain escrow with prize payouts distributed directly by contract.
  - `EventType.ExternalListing (1)`: Curated discovery for external hackathons (Devpost, DoraHacks).
- **Reviewer Evaluation & Scoring**: Organizers register approved reviewers who submit structured scorecard evaluations (1–100 integer scores or weighted criteria rubrics).
- **Deliberation & Settlement**: Following review deliberation, the organizer finalizes prize allocations to winning submitters.
- **Pull Payouts**: Winners invoke `claimPrize(eventId)` to withdraw their awarded USDC.

### 3.2 Fundora (`Fundora.sol`)
Manages milestone-gated bilateral grants:
- **Sequential Milestones**: Grants define specific milestones with dedicated allocations.
- **Verifiable Proof Submission**: Grantees submit deliverables; a `keccak256` hash of evidence is stored immutably onchain with the full URI emitted in event logs.
- **Quorum Approval**: Assigned reviewers vote to approve completed milestones. Once `requiredApprovals` is met, the milestone is marked complete and funds are moved to pending withdrawals.
- **Safety Invariant**: If a milestone is cancelled or expired, remaining unspent USDC is returned to the funder via `claimFunderRefund()`.

### 3.3 AdminRegistry (`AdminRegistry.sol`)
Maintains an onchain registry of vetted community organizers:
- **Sybil Resistance**: Organizers pay a nominal registration fee in native USDC.
- **Profile Binding**: Links the caller's address to their Arc House handle, organization name, and metadata URI.

---

## 4. Key Security Invariants

1. **Strict Pull-Payment Pattern**:
   Contracts never execute automatic push-transfers (`transfer`) inside deliberation, voting, or review functions. When funds are unlocked, they are credited to an internal balance map (`pendingPrizeWithdrawals` / `pendingWithdrawals`). Claimants pull funds using dedicated claim transactions.
   - *Rationale*: Eliminates gas exhaustion vulnerabilities, denial-of-service from recipient revert logic, reentrancy attacks, and USDC blocklist contagion.
2. **Reentrancy Protection**:
   All state updates follow Checks-Effects-Interactions (CEI). OpenZeppelin's `ReentrancyGuard` protects all public fund withdrawal entrypoints.
3. **Safe ERC-20 Handling**:
   Token interactions use OpenZeppelin's `SafeERC20` wrapper to ensure safe transfers across EVM and precompiled tokens.
4. **Deadline Enforcement**:
   Submission and judging deadlines are enforced against `block.timestamp` and cannot be modified after event creation.

