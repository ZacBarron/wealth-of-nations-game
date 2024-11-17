require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config({ path: '.env.local' });

console.log("Config check:");
console.log("- ARBISCAN_API_KEY exists:", !!process.env.ARBISCAN_API_KEY);
console.log("- ARBISCAN_API_KEY length:", process.env.ARBISCAN_API_KEY ? process.env.ARBISCAN_API_KEY.length : 0);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: [process.env.PRIVATE_KEY]
    },
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      arbitrum: process.env.ARBISCAN_API_KEY,
      arbitrumSepolia: process.env.ARBISCAN_API_KEY
    },
    customChains: [
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io"
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io"
        }
      }
    ]
  }
};
