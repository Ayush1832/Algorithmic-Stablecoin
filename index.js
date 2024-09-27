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
    // await mintAUSD("100");
    // await burnAUSD(50);
    await mintUSDT(100);
    await mintWETH(100);
    await approveWETH(200000),
    await approveUSDT(200000),
    await setAUSD();
    await usdtVault();
    await wethVault();
    await usdtDeposit(0, 10);
    await wethDeposit(1, 20);
    await setWETH();
    await setReserve();
    await setFeedAddress();
    await pricetoWei();
    await getCollateralPrice();
    await ReBalanceCollateral();
    await validatePeg();
    const ausdPrice = await getAusdPrice();
    console.log("AUSD Price:", ausdPrice);
  } catch (error) {
    console.error("Error during execution:", error);
  }
}

test();
