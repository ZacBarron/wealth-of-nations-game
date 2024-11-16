async function main() {
  console.log("Getting contract instance...");
  const starterPack = await ethers.getContractAt(
    "StarterPack",
    "0x95A131ebcD1B01ff42ecaDA626ABC50e05dDb7af"
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