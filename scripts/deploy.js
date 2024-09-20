const { ethers } = require("hardhat");

async function main() {
  const AUSDGovernance = await ethers.getContractFactory("AUSDGovernance");
  const ausdGovernance = await AUSDGovernance.deploy();
  await ausdGovernance.deployed();
  console.log("AUSDGovernance deployed to:", ausdGovernance.address);

  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.deployed();
  console.log("PriceOracle deployed to:", priceOracle.address);

  const ReserveContract = await ethers.getContractFactory("ReserveContract");
  const reserveContract = await ReserveContract.deploy();
  await reserveContract.deployed();
  console.log("ReserveContract deployed to:", reserveContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
