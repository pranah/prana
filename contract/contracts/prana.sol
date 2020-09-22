// SPDX-License-Identifier: MIT

pragma solidity >=0.4.16 <0.8.0;

import "../../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";


//prana main contract.


contract prana is ERC721 {

    using Counters for Counters.Counter;

    //to automate tokenId generation
    Counters.Counter private _tokenIdTracker;

    //AccessControl and Ownable can be added instead of owner if time permits
    constructor() ERC721("PranaBooks", "PBT") public {
        owner = msg.sender;
        // edit rentedBlocks to appropriate time/number of blocks before final version
        // for a two-week rental period, the rentedBlocks would be 100800 blocks.
        // assuming the block time is 12 seconds on average.
        rentedBlocks = 100;
    }

    //address of the contract deployer
    address owner;

    //rented number of blocks, to count time
    uint256 rentedBlocks;

    //address of the helper contract
    address pranaHelperAddress;

    EnumerableSet.UintSet upForResaleTokens;

    EnumerableSet.UintSet upForRentingTokens;

    //Modifier for onlyOwner functions
    //this could be figured out with AccessControl if there's enough time
    modifier onlyOwner {
       require(msg.sender == owner, 'You are not the contract owner to call this function!');
       _;
    }

    // A nonce to ensure unique id for each new token.
    //deprecated in favor of _tokenIdTracker
    // uint256 public nonce;  // might need more work

    // struct to store book details. For each new title.
    // bytes32(encryptedBookDataHash) - the actual content of the book
    // bytes32(unencryptedBookDetailsCID) - cid to pull book cover and other details to show the world
    // This is where the linkage of the contract with storage mechanisms happen
    // address(publisherAddress) -  address of the content creator/publisher
    // uint256(bookPrice) - price of the book that the creator asks for direct purchase
    // uint256(transactionCut) - cut of further transactions on copies
    // that the creator lay claim to. Stored as a percentage.
    struct BookInfo{
        string encryptedBookDataHash;
        string unencryptedBookDetailsCID;
        address payable publisherAddress;
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
    // so that people can brag about owning the 1st copy, 100th copy etc,
    // add sell them at a premium
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
        uint256 rentedAtBlock;
    }


    // tokenId to TokenDetails mapping
    mapping (uint256 => TokenDetails) internal tokenData;

    // account balances, for everyone involved.
    // mapping (address => uint256) internal accountBalance;


    // Mapping from holder address to their (enumerable) set of rented tokens
    mapping (address => EnumerableSet.UintSet) private _renteeRentedTokens;

    //Event to emit when a new book is published with its ISBN and publisher address
    event BookPublished(address indexed publisher, uint256 indexed isbn,
    string bookCoverAndDetails, uint256 indexed price, uint256 transactionCut);

    //Event to emit when a tokenOwner puts out a token for sale
    event TokenForSale(uint256 indexed resalePrice, uint256 indexed isbn, uint256 indexed tokenId);

    //Event to emit when the tokenOwner puts out a token for renting
    event TokenForRenting(uint256 indexed rentingPrice, uint256 indexed isbn, uint256 indexed tokenId);

    //Event to emit when a token is rented
    event TokenRented(uint256 indexed isbn, uint256 indexed tokenId, address indexed rentee);

    // function to pass in the adddresses of each of the contract
    // so that they may refer to each other. Crude version
    function setPranaHelperAddress(address _pranaHelperAddress) public onlyOwner{
        pranaHelperAddress = _pranaHelperAddress;
    }

    // overriding _beforeTokenTransfer()
    // this ensure good behavior whenever a token transfer happens with money involved.
    // various actors get their cut before ownership is transfered
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        if(from != address(0) && to != address(0)){
            if(msg.value>0){
                _updateAccountBalances(tokenId);
            }
        }
        // Resale and Renting flags updated to false at each Token Transfer
        tokenData[tokenId].isUpForResale = false;
        tokenData[tokenId].isUpForRenting = false;

        upForResaleTokens.remove(tokenId);
     }

    // an internal function to update the balances for each monetary transaction
    // not sure if msg.value works well with internal functions
    function _updateAccountBalances(uint256 tokenId) internal {

        // transactinCut for the author/publisher gets debited
        // accountBalance[booksInfo[tokenData[tokenId].isbn].publisherAddress] += booksInfo[tokenData[tokenId].isbn].transactionCut*(msg.value/100);
        (booksInfo[tokenData[tokenId].isbn].publisherAddress).transfer(booksInfo[tokenData[tokenId].isbn].transactionCut*(msg.value/100));

        //the remaining money goes to the token owner
        // accountBalance[ownerOf(tokenId)] += msg.value - (booksInfo[tokenData[tokenId].isbn].transactionCut*(msg.value/100));
        address payable tokenOwner = payable(ownerOf(tokenId));
        (tokenOwner).transfer(msg.value - (booksInfo[tokenData[tokenId].isbn].transactionCut*(msg.value/100)));
        //  a better way would be to use call.value()(), but using .transfer for now

    }

    //function to add book details into the chain i.e. publish the book
    function publishBook(
        string memory _encryptedBookDataHash, //TOCHECK: bytes32 vs bytes memory
        uint256 _isbn,
        uint256 _price,
        string memory _unencryptedBookDetailsCID,
        uint256 _transactionCut)
        public {
        require(booksInfo[_isbn].publisherAddress==address(0), "This book has already been published!");
        require(_transactionCut > 0 && _transactionCut < 80, "Your cut can't be more than 80% of the total");
        booksInfo[_isbn].encryptedBookDataHash = _encryptedBookDataHash;
        booksInfo[_isbn].publisherAddress = msg.sender;
        booksInfo[_isbn].bookPrice = _price;
        booksInfo[_isbn].unencryptedBookDetailsCID = _unencryptedBookDetailsCID;
        booksInfo[_isbn].transactionCut = _transactionCut;
        booksInfo[_isbn].bookSales = 0;

        //event that serves as an advertisement
        //last argument might be needed to change back to price
        emit BookPublished(msg.sender, _isbn, _unencryptedBookDetailsCID, _price, _transactionCut);

    }

    //function to purchase books directly from the publisher.
    //New tokens will be minted here.
    //Could be assigned to Minter_Role in AccessControl and redirected from the helper contract
    function directPurchase(uint256 _isbn) public payable returns (bool) {
        //to revert back if the buyer doesn't have the price set by the author.
        require(booksInfo[_isbn].publisherAddress != address(0),"ISBN does not exist !");
        require(msg.value >= booksInfo[_isbn].bookPrice,"Insufficient funds ! Please pay the price as set by the author.");
        //a new tokenId is generated, and a new token is minted with that ID.
        uint256 tokenId = _tokenIdTracker.current();
        _safeMint(msg.sender, tokenId);
        _tokenIdTracker.increment();
        //once a token's succesfully minted, update the various details.
        booksInfo[_isbn].bookSales++;

        tokenData[tokenId].isbn = _isbn;
        tokenData[tokenId].copyNumber = booksInfo[_isbn].bookSales;
        tokenData[tokenId].rentee = address(0);
        tokenData[tokenId].rentedAtBlock = 0;

        // the money goes to the plubisher's accountBalance.
        // accountBalance[booksInfo[_isbn].publisherAddress] += msg.value;
        (booksInfo[_isbn].publisherAddress).transfer(msg.value);
        return true;
    }

    // function to put a token for sale
    // a user can update the resalePrice by just putting it up for sale again (may not be needed)
    function putTokenForSale(uint256 salePrice, uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "You are not this token's owner");
        require(tokenData[tokenId].isUpForRenting == false,
        "Can't put a token for sale while it's put for renting");
        require(salePrice >= 0, "Price can't be negative");
        require(tokenData[tokenId].rentedAtBlock + rentedBlocks < block.number,
        "The current renting period is not over yet");
        tokenData[tokenId].resalePrice = salePrice;
        tokenData[tokenId].isUpForResale = true;

        // The helper contract gets approved for token transfer when someone's ready to buy
        approve(pranaHelperAddress, tokenId);
        upForResaleTokens.add(tokenId);
        // event that serves as advertisement for all
        emit TokenForSale(salePrice, tokenData[tokenId].isbn, tokenId);
    }

    // To buy a token that's been put for sale.
    // function will always be called by pranaHelper as the approved address for tokenId
    function buyToken(uint256 tokenId, address _tokenRecipient) public payable {
        require(tokenData[tokenId].isUpForResale == true,
        "This token hasn't been put for sale by the token owner");

        require(msg.value >= tokenData[tokenId].resalePrice,
        "Your price is too low for this token");


        safeTransferFrom(ownerOf(tokenId), _tokenRecipient, tokenId);



    }

    // function to put a copy for renting, ownership doesn't change.
    function putForRent(uint256 _newPrice, uint256 tokenId) public{
        require(msg.sender == ownerOf(tokenId), "You are not this token's owner");
        require(tokenData[tokenId].isUpForResale == false,
        "Can't put a copy up for renting if it's already on sale!");
        if(tokenData[tokenId].rentee != address(0)){
                require(block.number > tokenData[tokenId].rentedAtBlock + rentedBlocks,
                "The renting period is not over yet to put it for renting again");
            }
        tokenData[tokenId].rentingPrice = _newPrice;
        tokenData[tokenId].isUpForRenting = true;
        tokenData[tokenId].rentee = address(0);//No one's rented it as of now
        upForRentingTokens.add(tokenId);
        emit TokenForRenting(_newPrice, tokenData[tokenId].isbn, tokenId);
    }

    //function to actually rent a copy for content consumption
    function rentToken(uint256 tokenId) public payable {
        require(tokenData[tokenId].isUpForRenting == true,
        "This copy hasn't been put for renting by the owner");
        require(tokenData[tokenId].rentee == address(0),
        "This copy has been rented by someone already");
        require(msg.value >= tokenData[tokenId].rentingPrice,
        "Your price isn't sufficient to rent this copy");
        require(msg.sender != ownerOf(tokenId), "Token Owner can't rent one's own token");

        tokenData[tokenId].rentee = msg.sender;
        tokenData[tokenId].rentedAtBlock = block.number;
        tokenData[tokenId].isUpForRenting = false;

        _updateAccountBalances(tokenId);

        upForRentingTokens.remove(tokenId);
        
        // The token gets added to the personal collection of the rentee here.
        // TODO: figuring out where _renteeRentedTokens[msg.sender].remove(tokenId) goes.
        _renteeRentedTokens[msg.sender].add(tokenId);

        emit TokenRented(tokenData[tokenId].isbn, tokenId, msg.sender);

    }

    // To set tokenURI, by the token owner.
    // _uniqueCIDfortoken is a CID of a JSON object with all the extradetails like a personal note
    function setTokenURI(uint256 tokenId, string memory _uniqueCIDfortoken) public {
        require(ownerOf(tokenId)==msg.sender, "You are not the token owner");
        _setTokenURI(tokenId, _uniqueCIDfortoken);
    }

    //function to actually consume the content  you've bought/rented
    function consumeContent(uint256 tokenId) public view returns(string memory){
        require(ownerOf(tokenId) == msg.sender || tokenData[tokenId].rentee == msg.sender,
        "You are not authorized to view this copy!");
        if(ownerOf(tokenId) == msg.sender){
            if(tokenData[tokenId].rentee != address(0)){
                require(block.number > tokenData[tokenId].rentedAtBlock + rentedBlocks,
                "The renting period is not over yet for you to consume the content");
            }
        }
        else if(tokenData[tokenId].rentee == msg.sender){
            require(block.number <= tokenData[tokenId].rentedAtBlock + rentedBlocks,
            "Your rental period has expired");
        }
        return booksInfo[tokenData[tokenId].isbn].encryptedBookDataHash;
    }

    // function to get the balances stored in contract back into the respective owners' account
    // this is to mainly to reduce the number of transactions and transaction cost associated with it.
    // WARNING: Extensive testing required before this can be finalized!
    // function withdrawBalance() public payable{
    //     require(accountBalance[msg.sender] > 0, "You don't have any balance to withdraw");
    //     (msg.sender).transfer(accountBalance[msg.sender]);
    //     accountBalance[msg.sender] = 0;
    // }

    //function to view balance
    // function viewBalance() public view returns(uint256){
    //     return accountBalance[msg.sender];
    // }

    //function to get book details with the tokenId
    //returns CID of coverpic+bookname
    function viewTokenDetails(uint256 _tokenId) public view returns (uint256, string memory, uint256, uint256, bool) {
        require(_exists(_tokenId), "Token doesn't  exist");
        return (tokenData[_tokenId].isbn, booksInfo[tokenData[_tokenId].isbn].unencryptedBookDetailsCID,
        tokenData[_tokenId].copyNumber, tokenData[_tokenId].resalePrice, tokenData[_tokenId].isUpForResale);
    }
    
    //split up from viewTokenDetails, specifically for renting. To avoid Stack Too Deep Error
    function viewRentingTokenDetails(uint256 _tokenId) public view returns(uint256, string memory, uint256, uint256, uint256, bool) {
        require(_exists(_tokenId), "Token doesn't  exist");
        return(tokenData[_tokenId].isbn, booksInfo[tokenData[_tokenId].isbn].unencryptedBookDetailsCID, tokenData[_tokenId].copyNumber,
        tokenData[_tokenId].rentedAtBlock, tokenData[_tokenId].rentingPrice, tokenData[_tokenId].isUpForRenting);
    }

    function numberofTokensForResale() public view returns(uint256){
        return upForResaleTokens.length();
    }

    function tokenForResaleAtIndex(uint256 index) public view returns (uint256) {
        return upForResaleTokens.at(index);
    }

    function numberofTokensForRenting() public view returns(uint256){
        return upForRentingTokens.length();
    }

    function tokenForRentingAtIndex(uint256 index) public view returns (uint256) {
        return upForRentingTokens.at(index);
    }

    // rented token balance
    function numberOfRentedTokens(address _rentee) public view returns (uint256) {
        require(_rentee != address(0), "Zero Address, can't look up.");

        return _renteeRentedTokens[_rentee].length();
    }

    // rented token at a specific index
    function tokenOfRenteeByIndex(address _rentee, uint256 index) public view returns (uint256) {
        require(_rentee != address(0), "Zero Address, can't look up.");
        return _renteeRentedTokens[_rentee].at(index);
    }

    function viewBookDetails(uint256 _isbn) public view returns(string memory, address, uint256, uint256, uint256) {
        require(booksInfo[_isbn].publisherAddress!=address(0), "This book is not on the platform");
        return (booksInfo[_isbn].unencryptedBookDetailsCID, booksInfo[_isbn].publisherAddress,
        booksInfo[_isbn].bookPrice, booksInfo[_isbn].transactionCut, booksInfo[_isbn].bookSales);

    }

    function viewMyBookDetails(uint256 _isbn) public view returns(string memory, string memory, address, uint256, uint256, uint256) {
        require(booksInfo[_isbn].publisherAddress!=address(0), "This book is not on the platform");
        require(msg.sender == booksInfo[_isbn].publisherAddress, "You are not this book's author");
        return (booksInfo[_isbn].encryptedBookDataHash, booksInfo[_isbn].unencryptedBookDetailsCID, booksInfo[_isbn].publisherAddress,
        booksInfo[_isbn].bookPrice, booksInfo[_isbn].transactionCut, booksInfo[_isbn].bookSales);
    }
}
