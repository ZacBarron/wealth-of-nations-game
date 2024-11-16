const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StarterPack", function () {
  let StarterPack;
  let starterPack;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    StarterPack = await ethers.getContractFactory("StarterPack");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new StarterPack contract before each test
    starterPack = await StarterPack.deploy();
    await starterPack.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await starterPack.owner()).to.equal(owner.address);
    });

    it("Should have correct initial URI", async function () {
      const tokenId = 0;
      await starterPack.mint(addr1.address);
      expect(await starterPack.tokenURI(tokenId)).to.equal(
        "ipfs://bafkreigik42m7kgjpyuv3gagclure6c47hmcuqdfjnjkz3eqpuhwunw6aa"
      );
    });
  });

  describe("Minting", function () {
    it("Should allow only one mint per address", async function () {
      await starterPack.mint(addr1.address);
      await expect(
        starterPack.mint(addr1.address)
      ).to.be.revertedWith("Address has already claimed a starter pack");
    });
  });
});
