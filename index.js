const {
  mintAUSD,
  burnAUSD,
  mintUSDT,
  mintWETH,
  approveWETH,
  approveUSDT,
  setAUSD,
  usdtVault,
  wethVault,
  usdtDeposit,
  wethDeposit,
  governAUSD,
  transferAUSD,
  setWETH,
  setReserve,
  setFeedAddress,
  pricetoWei,
  getCollateralPrice,
  ReBalanceCollateral,
  validatePeg,
  getAusdPrice,
} = require("./EthersJS/Governance.js");

async function test() {
  try {
    // await mintAUSD(1000000);
    // // await burnAUSD(50);
    // await mintUSDT(10000);
    // await mintWETH(10000);
    // await approveWETH(200000),
    // await approveUSDT(200000),
    // await setAUSD();
    // await governAUSD();
    // await transferAUSD(500000);
    // await usdtVault();
    // await wethVault();
    // await usdtDeposit(0, 10);
    // await wethDeposit(1, 20);
    // await setWETH();
    // await setReserve();
    // await setFeedAddress();
    await pricetoWei();
    await getCollateralPrice();
    // await ReBalanceCollateral();
    await validatePeg();
    const ausdPrice = await getAusdPrice();
    console.log("AUSD Price:", ausdPrice);
  } catch (error) {
    console.error("Error during execution:", error);
  }
}

test();
