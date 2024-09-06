// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract USDT is ERC20, ERC20Burnable, Ownable {
    using SafeERC20 for IERC20;

    constructor() ERC20("USDTReserve", "USDT") Ownable(msg.sender) {}

    function mint(uint256 amount) external onlyOwner {
        _mint(msg.sender, amount);
    }
}
