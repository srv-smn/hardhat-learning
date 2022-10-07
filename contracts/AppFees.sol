// SPDX-License-Identifier: NONE
pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";


/**
 *
 * @author Himanshu Singh
*/
contract AppFees is Ownable{

    uint public totalFeesCollected;

    event Transfer(
        address indexed from, 
        address indexed to, 
        uint256 value
    );
    event Received(
        address indexed from, 
        address indexed to, 
        uint256 value
    );

    /**
     *
     * @notice receive collects all the ether sent to this smart contract
    */
    receive() external payable {
        totalFeesCollected += msg.value;
        emit Received(msg.sender, address(this), msg.value);
    }

    /**
     *
     * @notice transfer function is used to send some amount of ether to beneficiary
       @param beneficiary address where we want to send ether balance
       @param amount value of balance that needs to be transferred
    */
    function transfer(
        address beneficiary,
        uint256 amount
    ) external onlyOwner() {
        require(beneficiary != address(0), "INVALID_BENEFICIARY");
        require(amount > 0, "INVALID_AMOUNT");
        require(address(this).balance > amount, "INSUCCIFIENT_BALANCE");
        (bool success,) = beneficiary.call{value:amount}(new bytes(0));
        require(success, "ETH_TRANSFER_FAILED");
        emit Transfer(owner(), beneficiary, amount );
    }

    /**
     *
       @notice changes the owner to new owner
       @param newOwner address of the new owner
    */
    function transferOwnership(
        address newOwner
    ) public override onlyOwner {
        require(newOwner != address(0), "AppFees: new owner is the zero address");
        require(newOwner != owner(), "AppFees: Already a owner");
        _transferOwnership(newOwner);
    }

    /**
     *
     * @notice fetches the current Balance of the AppFees Smart Contract
       @return balance the new current available balance of the Smart Contract
    */
    function getBalance() public view returns (
        uint
    ){
        return address(this).balance;
    }

}
