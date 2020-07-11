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

    //Modifier for onlyOwner functions
    modifier onlyOwner {
       require(msg.sender == owner, 'You are not the contract owner to call this function!');
       _;
    }

    // struct to store book details. For each new title.
    // bytes32(encryptedBookData) - the actual content of the book
    // This is where the linkage of the contract with storage mechanisms happen
    // address(publisherAddress) -  address of the content creator/publisher
    // uint256(bookPrice) - price of the book that the creator asks for direct purchase
    // uint256(transactionCut) - cut of further transactions on copies 
    // that the creator lay claim to. Stored as a percentage.
    struct BookInfo{
        bytes32 encryptedBookData;  
        address publisherAddress;
        uint256 bookPrice;   
        uint256 transactionCut;    
    }

    // mapping for all books
    // ISBN is the key, its corresponding details is the value
    mapping(uint256 => BookInfo) internal booksInfo;





}
