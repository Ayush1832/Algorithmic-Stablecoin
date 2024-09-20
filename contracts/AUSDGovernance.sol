// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "./AUSD.sol";

contract AUSDGovernance is Ownable, ReentrancyGuard, AccessControl {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct SupChange {
        string method;
        uint256 amount;
        uint256 timestamp;
        uint256 blocknum;
    }

    struct ReserveList {
        IERC20 colToken;
    }

    mapping(uint256 => ReserveList) public rsvList;
    mapping(uint256 => SupChange) public _supplyChanges;

    AUSD private ausd;
    AggregatorV3Interface private priceOracle;
    address private reserveContract;
    uint256 public ausdsupply;
    address public datafeed;
    uint256 public supplyChangeCount;
    uint256 public stableColatPrice = 1e18;
    uint256 public stableColatAmount;
    uint256 private constant COL_PRICE_TO_WEI = 1e10;
    uint256 private constant WEI_VALUE = 1e18;
    uint256 public unstableColatAmount;
    uint256 public unstableColPrice;
    uint256 public reserveCount;

    bytes32 public constant GOVERN_ROLE = keccak256("GOVERN_ROLE");

    event RepegAction(uint256 time, uint256 amount);
    event Withdraw(uint256 time, uint256 amount);

    constructor(AUSD _ausd) {
        ausd = _ausd;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(GOVERN_ROLE, _msgSender());
    }

    function setDataFeedAddress(address contractaddress) external {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        datafeed = contractaddress;
        priceOracle = AggregatorV3Interface(datafeed);
    }

    function addColateralToken(IERC20 colcontract) external nonReentrant {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        rsvList[reserveCount].colToken = colcontract;
        reserveCount++;
    }

    function fetchColPrice() external nonReentrant {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        (, uint256 price, , , ) = priceOracle.latestRoundData();
        uint256 value = (price).mul(COL_PRICE_TO_WEI);
        unstableColPrice = value;
    }

    function setReserveContract(address reserve) external nonReentrant {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        reserveContract = reserve;
    }

    function colateralReBalancing() internal returns (bool) {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        uint256 stableBalance = rsvList[0].colToken.balanceOf(reserveContract);
        uint256 unstableBalance = rsvList[1].colToken.balanceOf(
            reserveContract
        );
        if (stableBalance != stableColatAmount) {
            stableColatAmount = stableBalance;
        }
        if (unstableBalance != stableColatAmount) {
            unstableColatAmount = unstableBalance;
        }
        return true;
    }

    function setAUSDSupply(uint256 totalSupply) external {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        ausdsupply = totalSupply;
    }

    function validatePeg() external nonReentrant {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        bool result = colateralReBalancing();
        if (result = true) {
            uint256 rawcolvalue = (stableColatAmount.mul(WEI_VALUE)).add(
                unstableColatAmount.mul(unstableColPrice)
            );
            uint256 colvalue = rawcolvalue.div(WEI_VALUE);
            if (colvalue < ausdsupply) {
                uint256 supplyChange = ausdsupply.sub(colvalue);
                ausd.burn(supplyChange);
                _supplyChanges[supplyChangeCount].method = "Burn";
                _supplyChanges[supplyChangeCount].amount = supplyChange;
            }
            if (colvalue > ausdsupply) {
                uint256 supplyChange = colvalue.sub(ausdsupply);
                ausd.mint(supplyChange);
                _supplyChanges[supplyChangeCount].method = "Mint";
                _supplyChanges[supplyChangeCount].amount = supplyChange;
            }
            ausdsupply = colvalue;
            _supplyChanges[supplyChangeCount].blocknum = block.number;
            _supplyChanges[supplyChangeCount].timestamp = block.timestamp;
            supplyChangeCount++;
            emit RepegAction(block.timestamp, colvalue);
        }
    }

    function withdraw(uint256 _amount) external nonReentrant {
        require(hasRole(GOVERN_ROLE, _msgSender()), "Not allowed");
        ausd.transfer(address(msg.sender), _amount);
        emit Withdraw(block.timestamp, _amount);
    }
}
