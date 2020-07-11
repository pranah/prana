// SPDX-License-Identifier: ISC

pragma solidity ^0.6.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


//prana main contract.

abstract contract prana is ERC1155 {
    //The abstract status must be changed as the functions are added.
    //currently added to avoid showing up error as the contract is written.

    constructor () public {
        owner = msg.sender;
    }

    //address of the contract deployer
    address owner;

}
