// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Greeter {
    string public greeting;

    constructor(string memory _initialGreeting) {
        greeting = _initialGreeting;
    }

    function setGreeting(string memory _newGreeting) public {
        greeting = _newGreeting;
    }

    function greet() public view returns(string memory) {
        return greeting;
    }

}
