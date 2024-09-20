require("dotenv").config();
const { ethers } = require("ethers");
const oracleABI = require("../contracts/ABI/oracleabi.json");
const reserveABI = require("../contracts/ABI/reserveabi.json");
const ausdABI = require("../contracts/ABI/ausdabi.json");
const governanceABI = require("../contracts/ABI/governanceabi.json");

const oracleEth = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419";
const reservecontract = "0x185fc55286db85582EAe742d82519ac037280758";
const ausdcontract = "0x34F6f14fA2998FD5d9e49f539cA569de834Cce2D";
const governanceContract = "0xc978ff894e6d16D0D6D8ca651253799682ae2EcB";

const ethrpc = "https://rpc.ankr.com/eth";
const amoyrpc = "https://polygon-amoy.drpc.org";

const ethprovider = new ethers.providers.JsonRpcProvider(ethrpc);
const amoyprovider = new ethers.providers.JsonRpcProvider(amoyrpc);
const key = `${process.env.PRIVATE_KEY}`;
const walleteth = new ethers.Wallet(key, ethprovider);
const walletamoy = new ethers.Wallet(key, amoyprovider);

const ethoracle = new ethers.Contract(oracleEth, oracleABI, walleteth);
const reserves = new ethers.Contract(reservecontract, reserveABI, walletamoy);
const ausd = new ethers.Contract(ausdcontract, ausdABI, walletamoy);
const governance = new ethers.Contract(
  governanceContract,
  governanceABI,
  walletamoy
);

// Function to mint AUSD
async function mintAUSD(amount) {
  try {
    const gasPrice = await amoyprovider.getGasPrice();
    const tx = await ausd.mint(amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"), // Set this to meet network requirement
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"), // Set total max fee per gas
      gasLimit: 1000000, // Adjust gas limit if needed
    });
    await tx.wait();
    console.log(`Minted ${amount} AUSD`);
  } catch (error) {
    console.error(error);
  }
}

// Function to burn AUSD
async function burnAUSD(amount) {
  try {
    const gasPrice = await amoyprovider.getGasPrice();
    const tx = await ausd.burn(amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`Burned ${amount} AUSD`);
  } catch (error) {
    console.error(error);
  }
  console.log("working");
}

// Estimate gas before sending the transaction
async function updateCollateralPrice() {
    try {
      const gasEstimate = await governance.estimateGas.fetchColPrice();
      const tx = await governance.fetchColPrice({
        gasLimit: gasEstimate,
        maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
        maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      });
      await tx.wait();
      console.log("Collateral price updated");
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
// Function to validate the peg of the AUSD stablecoin
async function validatePeg() {
  try {
    const tx = await governance.validatePeg();
    await tx.wait();
    console.log("Peg validated and AUSD supply adjusted");
  } catch (error) {
    console.error(error);
  }
}

// Function to deposit collateral into the reserve contract
async function depositCollateral(vid, amount) {
  try {
    const tx = await reserves.depositCollateral(vid, amount);
    await tx.wait();
    console.log(`Deposited ${amount} to vault ${vid}`);
  } catch (error) {
    console.error(error);
  }
}

// Function to withdraw collateral from the reserve contract
async function withdrawCollateral(vid, amount) {
  try {
    const tx = await reserves.withdrawCollateral(vid, amount);
    await tx.wait();
    console.log(`Withdrew ${amount} from vault ${vid}`);
  } catch (error) {
    console.error(error);
  }
}

// Function to get ETH price from the oracle
async function getEthPrice() {
  try {
    const ethprice = await ethoracle.latestRoundData();
    return Number(ethprice.answer.toString()) / 1e8;
  } catch (error) {
    console.error(error);
  }
}

// Function to get AUSD price based on collateral reserves and ETH price
async function getAusdPrice() {
  try {
    const ethPrice = await getEthPrice();
    const usdtcolraw = await reserves._rsvVault(0);
    const ethcolraw = await reserves._rsvVault(1);
    const ausdSupRaw = await ausd.totalSupply();
    const usdtcollateral = Number(usdtcolraw.amount.toString()) / 1e18;
    const ethcollateral = Number(ethcolraw.amount.toString()) / 1e18;
    const ausdsupply = Number(ausdSupRaw.toString()) / 1e18;
    const ausdprice =
      (usdtcollateral * 1 + ethcollateral * ethPrice) / ausdsupply;
    return ausdprice;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getEthPrice,
  getAusdPrice,
  mintAUSD,
  burnAUSD,
  updateCollateralPrice,
  validatePeg,
  depositCollateral,
  withdrawCollateral,
};
