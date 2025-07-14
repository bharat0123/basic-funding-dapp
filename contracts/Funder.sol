// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Funder {
    uint256 public numOfFunders;

    mapping(uint256 => address) private funders;

    function fund() external payable {
        funders[numOfFunders] = msg.sender;
        numOfFunders++;
    }

    function withdraw(uint256 withdrawAmount) external {
        require(withdrawAmount <= 2 ether, "Max 2 ETH withdraw allowed");
        payable(msg.sender).transfer(withdrawAmount);
    }

    receive() external payable {}
}
