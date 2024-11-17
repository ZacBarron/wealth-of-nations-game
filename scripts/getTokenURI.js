async function main() {
  console.log("Getting contract instance...");
  const starterPack = await ethers.getContractAt(
    "StarterPack",
    "0x8BdD9B03fCf2271F810BDfa0E5A05aFBD21C55AF"
  );

  console.log("Getting token URI...");
  try {
    const tokenURI = await starterPack.tokenURI(0);
    console.log("Token URI:", tokenURI);
  } catch (error) {
    console.error("Error getting tokenURI:", error.message);
  }

  console.log("Done!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script error:", error);
    process.exit(1);
  }); 