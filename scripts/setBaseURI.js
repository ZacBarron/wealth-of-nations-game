async function main() {
  const starterPack = await ethers.getContractAt(
    "StarterPack",
    "0x95A131ebcD1B01ff42ecaDA626ABC50e05dDb7af"
  );

  console.log("Setting new baseURI...");
  const tx = await starterPack.setBaseURI("ipfs://bafkreigik42m7kgjpyuv3gagclure6c47hmcuqdfjnjkz3eqpuhwunw6aa");
  await tx.wait();

  console.log("BaseURI updated successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
