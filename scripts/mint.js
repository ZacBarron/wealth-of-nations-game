async function main() {
  const starterPack = await ethers.getContractAt(
    "StarterPack",
    "0x95A131ebcD1B01ff42ecaDA626ABC50e05dDb7af"
  );

  console.log("Minting NFT...");
  const tx = await starterPack.mint("0xB4690D7a605f31c212aceeDd68DcC9B44b71A50C");  // Your address
  await tx.wait();

  console.log("NFT minted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
