// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract PriceOracle {
    using SafeMath for uint256;

    AggregatorV3Interface private priceOracle;
    uint256 public unstableColPrice;
    address public datafeed;

    function setDataFeedAddress(address contractaddress) external {
        datafeed = contractaddress;
        priceOracle = AggregatorV3Interface(datafeed);
    }

    function colPriceToWei() external {
        (, uint256 price, , , ) = priceOracle.latestRoundData();
        unstableColPrice = price.mul(1e10);
    }

    function rawColPrice() external view returns (uint256) {
        (, uint256 price, , , ) = priceOracle.latestRoundData();
        return price;
    }
}
