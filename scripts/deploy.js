const hre = require("hardhat");

async function main() {
  console.log("Config check:");
  console.log("- ARBISCAN_API_KEY exists:", !!process.env.ARBISCAN_API_KEY);
  console.log("- ARBISCAN_API_KEY length:", process.env.ARBISCAN_API_KEY?.length);

  console.log("Deploying StarterPack");
  
  const StarterPack = await hre.ethers.getContractFactory("StarterPack");
  const starterPack = await StarterPack.deploy();
  
  // Wait for deployment
  await starterPack.waitForDeployment();
  
  // Get the deployed address
  const deployedAddress = await starterPack.getAddress();
  console.log("StarterPack deployed to:", deployedAddress);

  // Wait for some confirmations
  const deploymentReceipt = await starterPack.deploymentTransaction().wait(5);
  console.log("Deployment confirmed in block:", deploymentReceipt.blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
