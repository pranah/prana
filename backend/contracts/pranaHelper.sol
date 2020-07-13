// SPDX-License-Identifier: ISC

pragma solidity ^0.6.0;


contract pranaHelper {


    constructor () public {
        owner = msg.sender;
    }

    //address of the contract deployer.
    address owner;
}