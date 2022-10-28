// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

contract Whitelist {
    uint8 public maxAddressWhitelisted;
    uint8 public numOfAddtessWhitelisted;
    mapping(address => bool) public addressesWhitelistedd;

    constructor(uint8 _maxAddressWhitelisted) {
        maxAddressWhitelisted = _maxAddressWhitelisted;
    }

    function addAddressToWhitelist() public {
        require(
            !addressesWhitelistedd[msg.sender],
            "You're already whitelisted"
        );
        require(
            numOfAddtessWhitelisted <= maxAddressWhitelisted,
            "Maximum addresses whitelisted"
        );

        addressesWhitelistedd[msg.sender] = true;

        numOfAddtessWhitelisted += 1;
    }
}
