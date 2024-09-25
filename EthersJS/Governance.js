require("dotenv").config();
const { ethers } = require("ethers");
const oracleABI = require("../contracts/ABI/oracleabi.json");
const priceoracleABI = require("../contracts/ABI/priceoracle.json");
const reserveABI = require("../contracts/ABI/reserveabi.json");
const ausdABI = require("../contracts/ABI/ausdabi.json");
const governanceABI = require("../contracts/ABI/governanceabi.json");

const oracleEth = "0xF0d50568e3A7e8259E16663972b11910F89BD8e7";
const priceOracleContract = "0x7A400b243B25744945f28c2B3E033A849Fbef5a2";
const reservecontract = "0x185fc55286db85582EAe742d82519ac037280758";
const ausdcontract = "0x34F6f14fA2998FD5d9e49f539cA569de834Cce2D";
const governanceContract = "0xc978ff894e6d16D0D6D8ca651253799682ae2EcB";
const WETHcontract = "0x1FCa0410D8Bc7305A2a24b14667A752FF52D709e";

const ethrpc = "https://rpc.ankr.com/eth";
const amoyrpc = "https://rpc.ankr.com/polygon_amoy";

const ethprovider = new ethers.providers.JsonRpcProvider(ethrpc);
const amoyprovider = new ethers.providers.JsonRpcProvider(amoyrpc);
const key = `${process.env.PRIVATE_KEY}`;
const walleteth = new ethers.Wallet(key, ethprovider);
const walletamoy = new ethers.Wallet(key, amoyprovider);

const ethoracle = new ethers.Contract(oracleEth, oracleABI, walleteth);
const priceoracle = new ethers.Contract(priceOracleContract,priceoracleABI,walletamoy);
const reserves = new ethers.Contract(reservecontract, reserveABI, walletamoy);
const ausd = new ethers.Contract(ausdcontract, ausdABI, walletamoy);
const governance = new ethers.Contract(governanceContract,governanceABI,walletamoy);

// Function to mint AUSD
async function mintAUSD(amount) {
  try {
    const gasPrice = await amoyprovider.getGasPrice();
    const tx = await ausd.mint(amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
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
}
//Adding collateral token
async function setAUSD() {
  try {
    const tx = await governance.addColateralToken(ausdcontract, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`AUSD collateral added`);
  } catch (error) {
    console.error(error);
  }
}

async function setWETH() {
  try {
    const tx = await governance.addColateralToken(WETHcontract, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`WETH collateral added`);
  } catch (error) {
    console.error(error);
  }
}

//set Reserve Contract
async function setReserve() {
  try {
    const tx = await governance.setReserveContract(reservecontract, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`Added reserve contract`);
  } catch (error) {
    console.error(error);
  }
}


async function setFeedAddress() {
  try {
    const tx = await governance.setDataFeedAddress(oracleEth, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    const receipt = await tx.wait();
    console.log("Data Feed address set to:", oracleEth);
  } catch (error) {
    console.error("Error setting data feed address:", error);
  }
}


async function pricetoWei() {
  try {
    const tx = await priceoracle.colPriceToWei( {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    const receipt = await tx.wait();
    console.log("Price converted to Wei");
  } catch (error) {
    console.error("Error setting data feed address:", error);
  }
}

// Function to fetch and set new collateral price from the oracle in governance contract
async function getCollateralPrice() {
  try {
    const tx = await governance.fetchColPrice({
      gasLimit: 1000000,
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
  setAUSD,
  setWETH,
  setFeedAddress,
  pricetoWei,
  getCollateralPrice,
  validatePeg,
  depositCollateral,
  withdrawCollateral,
};
