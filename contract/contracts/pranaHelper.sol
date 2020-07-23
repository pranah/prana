// SPDX-License-Identifier: ISC

pragma solidity ^0.6.0;


contract PranaInterface{
    function buyToken(uint256 tokenid, address _tokenRecipient) public payable{}
}

contract pranaHelper {


    constructor () public {
        owner = msg.sender;
    }

    //address of the contract deployer.
    address owner;

    //address of the prana contract
    address pranaAddress;

    //Modifier for onlyOwner functions
    modifier onlyOwner {
       require(msg.sender == owner, 'You are not the contract owner to call this function!');
       _;
    }

    function setPranaAddress(address _pranaAddress) public onlyOwner{
        pranaAddress = _pranaAddress;
    }

    function buyTokenFromPrana(uint tokenId) public payable{
        PranaInterface P = PranaInterface(pranaAddress);
        P.buyToken{value:msg.value}(tokenId, msg.sender);
    }

}