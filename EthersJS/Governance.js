require("dotenv").config();
const { ethers } = require("ethers");
const oracleABI = require("../contracts/ABI/oracleabi.json");
const priceoracleABI = require("../contracts/ABI/priceoracle.json");
const reserveABI = require("../contracts/ABI/reserveabi.json");
const ausdABI = require("../contracts/ABI/ausdabi.json");
const governanceABI = require("../contracts/ABI/governanceabi.json");
const usdtABI = require("../contracts/ABI/usdtabi.json");
const wethABI = require("../contracts/ABI/wethabi.json");

const oracleEth = "0xF0d50568e3A7e8259E16663972b11910F89BD8e7";
const priceOracleContract = "0x7A400b243B25744945f28c2B3E033A849Fbef5a2";
const reservecontract = "0x5E6EDcD220c429E6646525FBAa84b4424aE94E3f";
const ausdcontract = "0x34F6f14fA2998FD5d9e49f539cA569de834Cce2D";
const governanceContract = "0x43E61135d68868B6B95eB62a6eaB46c80E371bF9";
const WETHcontract = "0x9FB922E0A3254e95f68Afe7156bf1006b3af5005";
const USDTcontract = "0x9178E26a790CF34d9d69A47E900B59114BcdC6d4"

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
const usdt = new ethers.Contract(USDTcontract,usdtABI,walletamoy);
const weth = new ethers.Contract(WETHcontract,wethABI,walletamoy);


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

// Function to mint USDT
async function mintUSDT(amount) {
  try {
    const tx = await usdt.mint(amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`Minted ${amount} USDT`);
  } catch (error) {
    console.error(error);
  }
}

// Function to mint WETH
async function mintWETH(amount) {
  try {
    const tx = await weth.mint(amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`Minted ${amount} WETH`);
  } catch (error) {
    console.error(error);
  }
}

// Function to approve reserve contract in WETH
async function approveWETH(amount) {
  try {
    const tx = await weth.approve(reservecontract, amount ,{
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`Approved ${amount} WETH`);
  } catch (error) {
    console.error(error);
  }
}

// Function to approve reserve contract in USDT
async function approveUSDT(amount) {
  try {
    const tx = await usdt.approve(reservecontract, amount ,{
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`Approved ${amount} USDT`);
  } catch (error) {
    console.error(error);
  }
}

//Adding USDT to Vault 0
async function usdtVault() {
  try {
    const tx = await reserves.addReserveVault(USDTcontract, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`USDT added to vault 0`);
  } catch (error) {
    console.error(error);
  }
}

//Adding WETH to Vault 1
async function wethVault() {
  try {
    const tx = await reserves.addReserveVault(WETHcontract, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`WETH added to vault 1`);
  } catch (error) {
    console.error(error);
  }
}

//Depositing USDT to reserve
async function usdtDeposit(vid, amount) {
  try {
    const tx = await reserves.depositCollateral(vid, amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`${amount} USDT Deposited to ${vid}`);
  } catch (error) {
    console.error(error);
  }
}

//Depositing WETH to reserve
async function wethDeposit(vid, amount) {
  try {
    const tx = await reserves.depositCollateral(vid, amount, {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    await tx.wait();
    console.log(`${amount} WETH Deposited to ${vid} `);
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
    console.error("Error converting to wei:", error);
  }
}

// Function to fetch and show ETH/USD price from the oracle
async function getCollateralPrice() {
  try {
    const tx = await governance.fetchColPrice({
      gasLimit: 1000000,
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
    });
    await tx.wait();
    const collateralPrice = await governance.getLatestColPrice();
    const formattedPrice = ethers.utils.formatUnits(collateralPrice, 18);
    
    console.log("Updated ETH/USD collateral price: ", formattedPrice);
    return formattedPrice;
  } catch (error) {
    console.error("Error fetching collateral price:", error);
  }
}


//Collateral rebalancing
async function ReBalanceCollateral() {
  try {
    const tx = await governance.colateralReBalancing( {
      maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxFeePerGas: ethers.utils.parseUnits("30", "gwei"),
      gasLimit: 1000000,
    });
    const receipt = await tx.wait();
    console.log("Collateral Rebalanced");
  } catch (error) {
    console.error("Error rebalancing collateral:", error);
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
  mintUSDT,
  mintWETH,
  approveWETH,
  approveUSDT,
  usdtVault,
  wethVault,
  usdtDeposit,
  wethDeposit,

  setAUSD,
  setWETH,
  setReserve,
  setFeedAddress,
  pricetoWei,
  getCollateralPrice,
  ReBalanceCollateral,
  validatePeg,
  withdrawCollateral,
};
