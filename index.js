const {
  mintAUSD,
  burnAUSD,
  updateCollateralPrice,
  validatePeg,
  getAusdPrice,
} = require("./EthersJS/Governance.js");

async function test() {
  try {
    // await mintAUSD("100");
    // await burnAUSD(50);
    await updateCollateralPrice();
    // await validatePeg();
    // const ausdPrice = await getAusdPrice();
    // console.log("AUSD Price:", ausdPrice);
  } catch (error) {
    console.error("Error during execution:", error);
  }
}

test();
