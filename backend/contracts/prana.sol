// SPDX-License-Identifier: ISC

pragma solidity ^0.6.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


//prana main contract.

//IMPORTANT: edit out abstract!!!!!
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
    // bytes32(encryptedBookDataHash) - the actual content of the book
    // This is where the linkage of the contract with storage mechanisms happen
    // address(publisherAddress) -  address of the content creator/publisher
    // uint256(bookPrice) - price of the book that the creator asks for direct purchase
    // uint256(transactionCut) - cut of further transactions on copies 
    // that the creator lay claim to. Stored as a percentage.
    struct BookInfo{
        bytes32 encryptedBookDataHash;  
        address publisherAddress;
        uint256 bookPrice;   
        uint256 transactionCut;    
    }

    // mapping for all books
    // ISBN is the key, its corresponding details is the value
    mapping(uint256 => BookInfo) internal booksInfo;

    // struct for token details and transactions
    // uint256(isbn) binds the token to the book it points to
    // uint256(copyNumber) to count which copy of the book the token is
    // so that people can brag about owning the 1st copy, 100th copy etc, add sell them at a premium
    // uint256(resalePrice) is the price that tokenOwner asks to sell the token
    // bool(isUpForResale) is to advertise that the token is for sale
    // uint(rentingPrice) is the price for renting that the tokenOwner sets
    // bool (isUpForRenting) is to advertise that the token is for renting
    // address(rentee) so that the tokenOwner doesn't change and the token comes back after a while
    struct TokenDetails{
        uint256 isbn;
        uint256 copyNumber;
        // resale aspects
        uint256 resalePrice;
        bool isUpForResale;
        //Renting aspects (gonna be hard to properly figure out renting)
        uint256 rentingPrice;
        bool isUpForRenting;
        address rentee;
    }


    //tokenID to TokenDetails mapping
    mapping (uint256 => TokenDetails) internal tokenData;


    //Event to emit when a new book is published with its ISBN and publisher address
    event BookPublished(address indexed publisher, uint256 indexed isbn, uint256 indexed price);


    //function to add book details into the chain i.e. publish the book
    function publishBook(
        bytes32 _encryptedBookDataHash, 
        uint256 _isbn, 
        uint256 _price, 
        uint256 _transactionCut) 
        public {
        require(booksInfo[_isbn].publisherAddress==address(0), "This book has already been published!");
        booksInfo[_isbn].encryptedBookDataHash = _encryptedBookDataHash;
        booksInfo[_isbn].publisherAddress = tx.origin;
        booksInfo[_isbn].bookPrice = _price;
        booksInfo[_isbn].transactionCut = _transactionCut;
        
        //event that serves as an advertisement, sort of.
        emit BookPublished(tx.origin, _isbn, _price);

    }







}
