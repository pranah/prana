// SPDX-License-Identifier: ISC

pragma solidity ^0.6.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


//prana main contract.

//IMPORTANT: edit out abstract!!!!!
abstract contract prana is ERC721 {
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

    // A nonce to ensure unique id for each new token.
    uint256 public nonce;  // might need more work

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
        uint256 bookSales;   
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


    // tokenId to TokenDetails mapping
    mapping (uint256 => TokenDetails) internal tokenData;

    // account balances, for everyone involved.
    mapping (address => uint256) internal accountBalance;


    //Event to emit when a new book is published with its ISBN and publisher address
    event BookPublished(address indexed publisher, uint256 indexed isbn, uint256 indexed price);

    //Event to emit when a tokenOwner puts out a token for sale
    event TokenForSale(uint256 indexed resalePrice, uint256 indexed isbn, uint256 indexed tokenId);


    //function to add book details into the chain i.e. publish the book
    function publishBook(
        bytes32 _encryptedBookDataHash, //TOCHECK: bytes32 vs bytes memory
        uint256 _isbn, 
        uint256 _price, 
        uint256 _transactionCut) 
        public {
        require(booksInfo[_isbn].publisherAddress==address(0), "This book has already been published!");
        booksInfo[_isbn].encryptedBookDataHash = _encryptedBookDataHash;
        booksInfo[_isbn].publisherAddress = tx.origin;
        booksInfo[_isbn].bookPrice = _price;
        booksInfo[_isbn].transactionCut = _transactionCut;
        booksInfo[_isbn].bookSales = 0;
        
        //event that serves as an advertisement
        emit BookPublished(tx.origin, _isbn, _price);

    }

    //function to purchase books directly from the publisher. 
    //New tokens will be minted here.
    function directPurchase(uint256 _isbn) public payable returns (bool) {
        //to revert back if the buyer doesn't have the price set by the author.
        require(booksInfo[_isbn].publisherAddress != address(0),"ISBN does not exist !");
        require(msg.value >= booksInfo[_isbn].bookPrice,"Insufficient funds ! Please pay the price as set by the author.");
        //a new tokenId is generated, and a new token is minted with that ID.
        uint256 tokenId = ++nonce;
        _safeMint(msg.sender, tokenId); 
        //once a token's succesfully minted, update the various details.
        booksInfo[_isbn].bookSales++;

        tokenData[tokenId].isbn = _isbn;
        tokenData[tokenId].copyNumber = booksInfo[_isbn].bookSales;
        tokenData[tokenId].isUpForResale = false;
        tokenData[tokenId].isUpForRenting = false;

        // 10% of directPurchase money goes to the contractOwner, might be a bit controversial
        accountBalance[owner] += (msg.value/100)*10;
        // the rest goes to the publisher
        accountBalance[booksInfo[_isbn].publisherAddress] += msg.value - ((msg.value/100)*10);
        return true;
    }

    // function to put a token for sale
    function putTokenForSale(uint256 salePrice, uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "You are not this token's owner");
        tokenData[tokenId].resalePrice = salePrice;
        tokenData[tokenId].isUpForResale = true;

        //TODO:
        //A helper contract that gets approved for token transfer when someone's ready to buy
        //approve(pranaHelperAddress, tokenId);
        // event that serves as advertisement for all
        emit TokenForSale(salePrice, tokenData[tokenId].isbn, tokenId);
    }

    // To buy a token that's been put for sale.
    function buyToken(uint256 tokenId) public payable {
        require(tokenData[tokenId].isUpForResale == true, 
        "This token hasn't been put for sale by the token owner");
        
        require(msg.value >= tokenData[tokenId].resalePrice, 
        "Your price is too low for this token");

        // 1% of resale money goes to the contractOwner, might be a bit controversial
        accountBalance[owner] += (msg.value/100)*1;

        // transactinCut for the author/publisher gets debited
        accountBalance[booksInfo[tokenData[tokenId].isbn].publisherAddress] +=  
        booksInfo[tokenData[tokenId].isbn].transactionCut*(msg.value/100);

        //the remaining money goes to the token owner
        accountBalance[ownerOf(tokenId)] +=
        msg.value - ((msg.value/100)*1 + 
        booksInfo[tokenData[tokenId].isbn].transactionCut*(msg.value/100));

        transferFrom(ownerOf(tokenId), msg.sender, tokenId);
        tokenData[tokenId].isUpForResale = false;

        //TODO: 
        //msg.sender should be the approved helper contract
        //and the token should be assigned to the third party



    }


}
