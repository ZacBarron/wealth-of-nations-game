# Wealth of Nations: The Trading Card Game

**Wealth of Nations: The Trading Card Game** is a blockchain-based strategy game that brings the principles of economics and global trade to life in a competitive, immersive experience. Players build and manage their economies by collecting resource cards, deploying powerful leaders, and engaging in strategic trades to outwit their opponents. Drawing inspiration from Adam Smith’s *The Wealth of Nations*, the game challenges players to balance production, trade, and diplomacy as they race to dominate the global economy.

This project was built as part of the **Alchemy Track** at the **Pool Hacker House** during **Devcon 7 SEA** in **Bangkok, November 2024**. The rules for the Alchemy Track required participants to use **Alchemy Account Kit** and encouraged use of their gas sponsorship functionality and other Alchemy APIs (such as their **NFT API** or **Transfer API**) to create an application. I decided to design this trading card game leveraging NFT mechanics to demonstrate the potential of blockchain in gaming.

---

## Core Gameplay

- **Collect Resources**: Gather key economic assets such as Gold, Steel, Food, Energy, and Technology to fuel your industries and grow your wealth.
- **Trade Strategically**: Negotiate with other players in dynamic trade sessions where supply and demand dictate market prices.
- **Deploy Leaders and Policies**: Play influential leaders and groundbreaking policies to gain competitive advantages and disrupt your rivals.
- **Build Industries**: Convert resources into powerful industries that generate ongoing wealth and economic influence.
- **Adapt to Global Events**: Navigate through event cards that simulate real-world economic challenges, such as recessions, trade wars, and technological breakthroughs.

---

## Blockchain Integration

Wealth of Nations leverages the power of blockchain to:

- **Ensure True Ownership**: Each card is an NFT, allowing players to trade, sell, or collect their assets freely.
- **Enable Transparent Gameplay**: All transactions and game mechanics are verifiable on the blockchain.
- **Introduce Gas Sponsorship**: Alchemy's gas sponsorship feature ensures seamless transactions without requiring players to manage gas fees manually.

---

## Inspiration and Themes

- Inspired by Adam Smith’s foundational economic theories, the game explores concepts like the division of labor, free markets, and international trade.
- Historical and modern leaders, industries, and economies serve as the foundation for card designs, blending realism with strategic gameplay.
- Each card tells a story, tying its functionality to a unique historical or thematic narrative.

---

## Why Play Wealth of Nations?

- **Strategic Depth**: Hone your skills in resource management, negotiation, and long-term planning.
- **True Ownership**: Own and trade your cards as blockchain-backed NFTs.
- **Dynamic Gameplay**: Every game is shaped by the players’ strategies and ever-changing economic landscapes.
- **Educational and Entertaining**: Learn about economic principles while engaging in a competitive and fun trading card experience.

---

## Technical Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Blockchain**: Arbitrum Sepolia Testnet
- **Smart Contracts**: Solidity with Hardhat
- **Authentication**: Alchemy Account Kit
- **NFT Integration**: Alchemy SDK

---

## Project Status

### Completed Work
- ✅ **Basic frontend setup** with Next.js (login and logout pages)
- ✅ **Alchemy Account Kit integration** for login/logout
- ✅ **Starter pack NFT contract** deployed & metadata/image published to IPFS
- ✅ **NFT minting functionality** (claim pack)
- ✅ **Manage frontend** to only allow one starter pack per user account
- ✅ **Minting-related success/failure messages** and error handling
- ✅ **Placeholder NFT metadata/image** for when it can't be retrieved from IPFS
- ✅ **Fix NFT metadata retrieval** and ensure proper rendering using Alchemy's NFT API (resolving issues with incorrect tokenURI formatting).
- ✅ **Create dashboard** update the logged in experience to show a dashboard with starter pack, activity, stats, and navigation links.

### Immediate Priorities
📝 **Flesh out placeholder navigation links and sections**:
  - Build out rest of logged in experience.
📝 **Loading states for collection items**:
  - Display loading state while retrieving NFT metadata and image.
- 📝 **Build a "My Items" section**:
  - Display owned packs with metadata (name, image, description).
  - Add a placeholder "Open Pack" button for future functionality.
- 📝 **Create responsive styling** for the "My Items" section using Tailwind CSS.

### Mid-Term Goals
- 📝 **Implement the "Open Pack" mechanic**:
  - Burn the pack NFT.
  - Mint and reveal 5 individual cards (NFTs).
  - Display revealed cards in the "My Items" section.

### Long-Term Goals
- 📝 **Design and implement the card trading system**:
  - Enable players to trade NFTs with each other.
  - Create a simple marketplace UI for listing, buying, and selling cards.
- 📝 **Develop game mechanics** for resource management and leader deployment.
- 📝 **Add support for dynamic event cards** that simulate global economic events.

---

**Are you ready to build the world's most powerful economy?**

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/ZacBarron/wealth-of-nations-game.git
cd wealth-of-nations-game
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_STARTER_PACK_ADDRESS=0x6B5A3Ed3aDF90Bc5aD32365F1b8683DDed2B4337
NEXT_PUBLIC_GAS_POLICY_ID=84679efc-d4b4-4e93-b93d-5cb99ff6adc3
NEXT_PUBLIC_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/your_alchemy_key

```

4. Run the development server:
```bash
npm run dev
```

## Smart Contracts

The main contract (`StarterPack.sol`) handles:
- NFT minting (ERC721)
- Ownership verification
- Base URI management
- Supply limits (10,000 max supply)
- Pause functionality for emergency stops

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License

Copyright (c) 2024 Zac Barron

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.