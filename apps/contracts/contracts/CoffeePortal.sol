// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CoffeePortal {
    // Memo struct to store supporter information
    struct Memo {
        address from;
        uint256 timestamp;
        string message;
        string name;
    }

    // Owner of the contract
    address payable public owner;

    // Array to store all memos
    Memo[] public memos;

    // Events
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Constructor to set the owner
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Function to buy coffee and leave a message
     * @param name The name of the supporter
     * @param message The message from the supporter
     */
    function buyCoffee(string memory name, string memory message) public payable {
        require(msg.value > 0, "Must send some CELO!");

        // Create a new memo
        memos.push(Memo({
            from: msg.sender,
            timestamp: block.timestamp,
            message: message,
            name: name
        }));

        // Emit event
        emit NewMemo(msg.sender, block.timestamp, name, message);
    }

    /**
     * @dev Function to get all memos
     * @return An array of all memos
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
     * @dev Function to withdraw funds (only owner)
     */
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance > 0, "No funds to withdraw");
        
        owner.transfer(address(this).balance);
    }

    /**
     * @dev Function to get the contract balance
     * @return The balance of the contract
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

