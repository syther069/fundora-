<div align="center">
  <img src="public/brand/fundora-logo-mark.png" alt="Fundora Logo" width="80" height="80" />
  <h1>Fundora</h1>
  <p><strong>Open-source grants, hackathons, and bounties on the Arc Network</strong></p>

  <p>    <a href="https://explorer.arc.io/address/0xa8353b078a258cd9caacc618b1fe1404666b9525"><img src="https://img.shields.io/badge/Arc_Mainnet-Active-0F766E?style=flat-square&logo=ethereum" alt="Arc Mainnet" /></a><a href="https://arc.io"><img src="https://img.shields.io/badge/USDC-Native_Gas_%26_Escrow-2775CA?style=flat-square&logo=circle" alt="Native USDC" /></a>
    <img src="https://img.shields.io/badge/Solidity-0.8.28-363636?style=flat-square&logo=solidity" alt="Solidity 0.8.28" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript Strict" />
  </p>
</div>

---

Fundora is an open-source application for discovering and running USDC-funded grants, hackathons, and bounties on the Arc Network. It combines a React web app with Solidity contracts for milestone grants, event prize escrow, reviewer workflows, and organizer registration.

Built with [Arc Studio](https://studio.arc.io).

The app runs on Arc Mainnet. Wallet transactions are signed by the connected wallet. Fundora's contracts use pull payments: approved recipients claim their own available funds instead of relying on a batch of outbound transfers.

## What it does

- Lists native onchain events and curated links to external events.
- Lets organizers create grants and competitions, set milestones or prize pools, and manage submissions.
- Supports reviewer voting for grant milestones and rubric-based scoring for event submissions.
- Records key submission evidence and settlement state onchain.
- Lets recipients claim approved USDC rewards from the relevant contract.

## Architecture

| Area | Location | Responsibility |
| --- | --- | --- |
| Web application | `src/` | React, TypeScript, Vite, wallet connection, event and grant workflows |
| Grant contract | `contracts/Fundora.sol` | Milestone-based funding, reviewer approvals, claims, and refunds |
| Events contract | `contracts/FundoraEvents.sol` | Event escrow, submissions, scoring, settlement, and prize claims |
| Organizer registry | `contracts/AdminRegistry.sol` | Onchain organizer registration and profile metadata |
| Contract tests | `contracts/test/` | Foundry tests for protocol behavior |
| Deployment scripts | `scripts/`, `contracts/script/` | Arc deployment and reviewer administration |

### Settlement flow

The important distinction in both grant and event settlement is that approval creates a claimable balance; the recipient submits a separate transaction to withdraw it.

```text
reviewer approval or organizer settlement
    -> contract credits the recipient's pending balance
    -> recipient calls the relevant claim function
    -> contract transfers the available USDC to the recipient
```

For example, `claimPrize` withdraws an event award and `claimPayment` withdraws an approved grant milestone payment. These are wallet transactions and require the connected account to approve them. See the contract implementations and [contract reference](docs/contracts.md) for the exact conditions and interfaces.

## Networks and deployed contracts

The frontend uses these deployed addresses by default. Explorer links open the corresponding address page.

### Arc Mainnet (chain ID `5042`)

| Contract | Address |
| --- | --- |
| [FundoraEvents](https://explorer.arc.io/address/0xa8353b078a258cd9caacc618b1fe1404666b9525) | `0xa8353b078a258cd9caacc618b1fe1404666b9525` |
| [AdminRegistry](https://explorer.arc.io/address/0xc57dbdb09123a6b648dc6d4bdf0e5ebf510b0ee1) | `0xc57dbdb09123a6b648dc6d4bdf0e5ebf510b0ee1` |
| [Fundora grants](https://explorer.arc.io/address/0x371b4b6894882082e706cd84b781bf749472a602) | `0x371b4b6894882082e706cd84b781bf749472a602` |


## Requirements

- Node.js 20 or later and npm.
- Foundry, if you plan to build or test the Solidity contracts.
- A browser wallet configured for Arc to use wallet-connected features.

## Quickstart

```bash
git clone https://github.com/syther069/fundora-.git
cd fundora-
npm ci
cp .env.example .env
npm run dev
```

Vite prints the local URL after starting, usually `http://localhost:5173`. Contract addresses have built-in defaults, so the frontend can run without filling in deployment secrets.

## Environment configuration

The frontend reads optional contract address overrides from `.env`. Leave them unset to use the deployed defaults in `src/contracts/`.

| Variable | Purpose |
| --- | --- |
| `VITE_FUNDORA_ADDRESS_MAINNET` | Arc Mainnet grant contract override |
| `VITE_ADMIN_REGISTRY_ADDRESS_MAINNET` | Arc Mainnet organizer registry override |
| `VITE_FUNDORA_EVENTS_ADDRESS_MAINNET` | Arc Mainnet events contract override |

`.env.example` also contains Circle client configuration and deployment settings. `VITE_CLIENT_KEY` and `VITE_CLIENT_URL` are used by Circle wallet flows. Deployment scripts read `PRIVATE_KEY` or `DEPLOYER_PRIVATE_KEY`, `ARC_MAINNET_RPC_URL`, and optionally `TREASURY_ADDRESS`; `scripts/add-mainnet-reviewer.ts` reads `PRIVATE_KEY` and optionally `ARC_MAINNET_RPC_URL`.

Never commit real private keys or other secrets. Variables prefixed with `VITE_` are embedded in the browser build and must not contain secrets.

## Common commands

```bash
npm run dev                 # Start the local Vite development server
npm run build               # Create the production frontend bundle in dist/
npm run preview             # Serve the production bundle locally
npm run typecheck           # Run the TypeScript compiler without emitting files
npm run check               # Run the repository's lint and type checks
npm run contracts:build     # Compile Solidity contracts with Foundry
npm run contracts:test      # Run the Foundry contract test suite
```

For a production frontend build, run `npm ci` followed by `npm run build`. The generated static site is written to `dist/`; deploy that directory to a static hosting provider configured to serve the app's `index.html` for client-side routes.

## Contract deployment

Deployment to Arc Mainnet is an administrative operation. Configure the deployer key and RPC URL locally; never put a private key in a `VITE_` variable.

```bash
# Simulate the deployment script without broadcasting transactions.
npm run deploy:mainnet:dry

# Broadcast the deployment; this uses the configured deployer key.
npm run deploy:mainnet
```

The deployment script accepts `PRIVATE_KEY` or `DEPLOYER_PRIVATE_KEY`, defaults to `https://rpc.mainnet.arc.io`, and uses `TREASURY_ADDRESS` when set (otherwise the deployer address). Review the script and verify the deployment output before updating frontend address overrides.

## Documentation

- [Smart contract reference and deployed addresses](docs/contracts.md)
- [Arc Network](https://arc.io/)
- [Arc Mainnet explorer](https://explorer.arc.io/)
- [Foundry documentation](https://book.getfoundry.sh/)
- [Vite documentation](https://vite.dev/guide/)

## License

No `LICENSE` file is currently included in this repository. Do not assume the code is MIT-licensed until a license is added.
