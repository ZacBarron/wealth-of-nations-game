async function main() {
  const starterPack = await ethers.getContractAt(
    "StarterPack",
    "0x8BdD9B03fCf2271F810BDfa0E5A05aFBD21C55AF"
  );

  console.log("Minting NFT...");
  const tx = await starterPack.mint("0x8BdD9B03fCf2271F810BDfa0E5A05aFBD21C55AF");  // Your address
  await tx.wait();

  console.log("NFT minted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
