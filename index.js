const {
  mintAUSD,
  burnAUSD,
  setAUSD,
  setWETH,
  setFeedAddress,
  pricetoWei,
  getCollateralPrice,
  validatePeg,
  getAusdPrice,
} = require("./EthersJS/Governance.js");

async function test() {
  try {
    // await mintAUSD("100");
    // await burnAUSD(50);
    await setAUSD(),
    await setWETH(),
    await setFeedAddress();
    await pricetoWei();
    // await getCollateralPrice();
    // await validatePeg();
    // const ausdPrice = await getAusdPrice();
    // console.log("AUSD Price:", ausdPrice);
  } catch (error) {
    console.error("Error during execution:", error);
  }
}

test();
