const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("GIE token test cases : ", async function () {

    let firstUser, secondUser, gieToken;

    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const amount_1 = "10000000000000000000";
    const amount_2 = "1000000000000000000000000000";
    const amount_3 = "1000000000000000000000000000000";
    const zeroAmount = "0";

    before(async () => {
        [firstUser, secondUser] = await ethers.getSigners();
        console.log(`Testing  contract with the account: ${firstUser.address}`);
    });

    // Deploy GIE token contract
    it("Should deploy GIE token contract", async function () {
        const GIEToken = await ethers.getContractFactory("GIEToken");
        gieToken = await GIEToken.deploy("GIEToken", "GIE");
        await gieToken.deployed();
        console.log("GIE Token contract deployed at : ", gieToken.address);
    });

    // name() function : positive test
    it("Should return name of GIE token : Valid inputs", async function () {
        const name = await gieToken.name();
        expect(name).to.equal("GIEToken");
    });

    // symbol() function : positive test
    it("Should return symbol of GIE token : Valid inputs", async function () {
        const symbol = await gieToken.symbol();
        expect(symbol).to.equal("GIE");
    });

    // decimals() function : positive test
    it("Should return decimal of GIE token : Valid inputs", async function () {
        const decimals = await gieToken.decimals();
        expect(decimals).to.equal(18);
    });

    // totalSupply() function : positive test
    it("Should return total supply of GIE token : Valid inputs", async function () {
        const totalSupply = await gieToken.totalSupply();
        expect(totalSupply).to.equal(amount_2);
    });

    // balanceOf() function : positive test
    it("Should return correct balance check : Positive check", async function () {
        const balance = await gieToken.balanceOf(firstUser.address);
        expect(BigNumber.from(balance)).eq(BigNumber.from("1000000000000000000000000000"));
    });

    // allowance() function : negative test
    it("Should check negative allowance : Negative check", async function () {
        const allowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(allowance)).lt(BigNumber.from(amount_1));
    });

    // mint() function : negative test
    it("Should revert on mint GIE tokens with invalid caller : Invalid check", async function () {
        expect(gieToken.connect(secondUser).mint(secondUser.address, "500000000000000000000")).to.be.revertedWith("Ownable: caller is not the owner");
    });

    // mint() function : negative test
    it("Should revert on mint GIE tokens with invalid caller zero address : Invalid check", async function () {
        expect(gieToken.connect(firstUser).mint(zeroAddress, "500000000000000000000")).to.be.revertedWith("ERC20: mint to the zero address");
    });

    // mint() function : negative test
    it("Should revert on mint GIE tokens with 0 amount : Invalid check", async function () {
        expect(gieToken.connect(firstUser).mint(firstUser.address, zeroAmount)).to.be.revertedWith("ERC20: amount to mint should be greater than zero");
    });

    // mint() function : positive test
    it("Should mint GIE tokens : Valid check", async function () {
        const oldBalance = await gieToken.balanceOf(firstUser.address);
        const result = await gieToken.connect(firstUser).mint(firstUser.address, "500000000000000000000");
        await result.wait();
        const newBalance = await gieToken.balanceOf(firstUser.address);
        expect(BigNumber.from(newBalance)).gt(BigNumber.from(oldBalance));
    });

    // burn() function : negative test
    it("Should revert on burn GIE tokens with invalid caller : Invalid check", async function () {
        expect(gieToken.connect(secondUser).burn(secondUser.address, "500000000000000000000")).to.be.revertedWith("Ownable: caller is not the owner");
    });

    // burn() function : negative test
    it("Should revert on burn GIE tokens with invalid caller zero address : Invalid check", async function () {
        expect(gieToken.connect(firstUser).burn(zeroAddress, "500000000000000000000")).to.be.revertedWith("ERC20: burn from the zero address");
    });

    // burn() function : negative test
    it("Should revert on burn GIE tokens with 0 amount : Invalid check", async function () {
        expect(gieToken.connect(firstUser).burn(firstUser.address, zeroAmount)).to.be.revertedWith("ERC20: amount to burn should be greater than zero");
    });

    // burn() function : negative test
    it("Should revert on burn GIE tokens with amount more than balance : Invalid check", async function () {
        expect(gieToken.connect(firstUser).burn(firstUser.address, amount_3)).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    // burn() function : positive test
    it("Should burn GIE tokens : Valid check", async function () {
        const oldBalance = await gieToken.balanceOf(firstUser.address);
        const result = await gieToken.connect(firstUser).burn(firstUser.address, "500000000000000000000");
        await result.wait();
        const newBalance = await gieToken.balanceOf(firstUser.address);
        expect(BigNumber.from(newBalance)).lt(BigNumber.from(oldBalance));
    });

    // transfer() function : negative test
    it("Should revert on transfer GIE token with zero address of receiver : Invalid check", async function () {
        expect(gieToken.transfer(zeroAddress, "20000000000000000000")).to.be.revertedWith("ERC20: transfer to the zero address");
    });

    // transfer() function : negative test
    it("Should revert on transfer GIE token with zero address of sender : Invalid check", async function () {
        expect(gieToken.connect(zeroAddress).transfer(secondUser.address, "20000000000000000000")).to.be.revertedWith("ERC20: transfer from the zero address");
    });

    // transfer() function : negative test
    it("Should revert on transfer GIE token with amount greater than balance : Invalid check", async function () {
        expect(gieToken.connect(firstUser).transfer(secondUser.address, amount_3)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    // transfer() function : positive test
    it("Should transfer GIE tokens to second user : Valid check", async function () {
        const oldBalance = await gieToken.balanceOf(secondUser.address);
        const result = await gieToken.transfer(secondUser.address, "20000000000000000000");
        await result.wait();
        const newBalance = await gieToken.balanceOf(secondUser.address);
        expect(BigNumber.from(newBalance)).gt(BigNumber.from(oldBalance));
    });

    // approve() function : negative test
    it("Should revert on approve GIE token with zero address of sender : Invalid check", async function () {
        expect(gieToken.connect(zeroAddress).approve(firstUser.address, "30000000000000000000")).to.be.revertedWith("ERC20: approve from the zero address");
    });

    // approve() function : negative test
    it("Should revert on approve GIE token with zero address of receiver : Invalid check", async function () {
        expect(gieToken.connect(firstUser).approve(zeroAddress, "30000000000000000000")).to.be.revertedWith("ERC20: approve to the zero address");
    });

    // approve() function : negative test
    it("Should revert on approve GIE token with zero amount : Invalid check", async function () {
        expect(gieToken.connect(firstUser).approve(secondUser.address, zeroAmount)).to.be.revertedWith("ERC20: amount to approve should be greater than zero");
    });

    // approve() function : positive test
    it("Should approve GIE tokens to second user : Valid check", async function () {
        const oldAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        const result = await gieToken.approve(secondUser.address, "30000000000000000000");
        await result.wait();
        const newAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(newAllowance)).gt(BigNumber.from(oldAllowance));
    });

    // allowance() function : positive test
    it("Should return allowance amount : Negative check", async function () {
        const allowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(allowance)).gt(BigNumber.from(zeroAmount));
    });

    // balanceOf() function : positive test
    it("Should return balance check : Negative check", async function () {
        const balance = await gieToken.balanceOf(firstUser.address);
        expect(BigNumber.from(balance)).gt(BigNumber.from(zeroAmount));
    });

    // transferFrom() function : negative test
    it("Should revert on transfer of GIE tokens having insufficient allowance via transferFrom method : Invalid check", async function () {
        expect(gieToken.connect(secondUser).transferFrom(firstUser.address, secondUser.address, amount_3)).to.be.revertedWith("ERC20: insufficient allowance");
    });

    // transferFrom() function : negative test
    it("Should revert on transfer of GIE tokens having zero address of sender via transferFrom method : Invalid check", async function () {
        expect(gieToken.connect(zeroAddress).transferFrom(firstUser.address, secondUser.address, zeroAmount)).to.be.revertedWith("ERC20: approve from the zero address");
    });

    // transferFrom() function : negative test
    it("Should revert on transfer of GIE tokens having zero address of receiver via transferFrom method : Invalid check", async function () {
        expect(gieToken.connect(secondUser).transferFrom(zeroAddress, secondUser.address, zeroAmount)).to.be.revertedWith("ERC20: approve to the zero address");
    });

    // transferFrom() function : negative test
    it("Should revert on transfer of GIE tokens having balance less than amount via transferFrom method : Invalid check", async function () {
        expect(gieToken.connect(secondUser).transferFrom(firstUser.address, secondUser.address, amount_3)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    // transferFrom() function : positive test
    it("Should transfer GIE tokens to second user via transferFrom method : Valid check", async function () {
        const oldAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        const result = await gieToken.connect(secondUser).transferFrom(firstUser.address, secondUser.address, "5000000000000000000");
        await result.wait();
        const newAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(newAllowance)).lt(BigNumber.from(oldAllowance));
    });

    // increaseAllowance() function : negative test
    it("Should revert on increaseAllowance GIE token with zero address of sender : Invalid check", async function () {
        expect(gieToken.connect(zeroAddress).increaseAllowance(firstUser.address, "30000000000000000000")).to.be.revertedWith("ERC20: approve from the zero address");
    });

    // increaseAllowance() function : negative test
    it("Should revert on increaseAllowance GIE token with zero address of receiver : Invalid check", async function () {
        expect(gieToken.connect(firstUser).increaseAllowance(zeroAddress, "30000000000000000000")).to.be.revertedWith("ERC20: approve to the zero address");
    });

    // increaseAllowance() function : negative test
    it("Should revert on increaseAllowance GIE token with zero amount : Invalid check", async function () {
        expect(gieToken.connect(firstUser).increaseAllowance(secondUser.address, zeroAmount)).to.be.revertedWith("ERC20: amount to approve should be greater than zero");
    });

    // increaseAllowance() function : positive test
    it("Should increase allowance for second user : Valid check", async function () {
        const oldAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        const result = await gieToken.connect(firstUser).increaseAllowance(secondUser.address, amount_1);
        await result.wait();
        const newAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(newAllowance)).gt(BigNumber.from(oldAllowance));
    });

    // increaseAllowance() function : negative test
    it("Should return true on increase allowance for second user : Positive check", async function () {
        const oldAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        const result = await gieToken.connect(firstUser).increaseAllowance(secondUser.address, amount_1);
        await result.wait();
        const newAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(newAllowance)).gt(BigNumber.from(oldAllowance));
    });

    // decreaseAllowance() function : negative test
    it("Should revert on decreaseAllowance GIE token with greater amount : Invalid check", async function () {
        expect(gieToken.connect(firstUser).decreaseAllowance(secondUser.address, amount_3)).to.be.revertedWith("ERC20: decreased allowance below zero");
    });

    // decreaseAllowance() function : negative test
    it("Should revert on decreaseAllowance GIE token with zero address of sender : Invalid check", async function () {
        expect(gieToken.connect(zeroAddress).decreaseAllowance(secondUser.address, zeroAddress)).to.be.revertedWith("ERC20: approve from the zero address");
    });

    // decreaseAllowance() function : negative test
    it("Should revert on decreaseAllowance GIE token with zero address of receiver : Invalid check", async function () {
        expect(gieToken.connect(firstUser).decreaseAllowance(zeroAddress, zeroAddress)).to.be.revertedWith("ERC20: approve to the zero address");
    });

    // decreaseAllowance() function : positive test
    it("Should decrease allowance for second user : Valid check", async function () {
        const oldAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        const result = await gieToken.connect(firstUser).decreaseAllowance(secondUser.address, amount_1);
        await result.wait();
        const newAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(newAllowance)).lt(BigNumber.from(oldAllowance));
    });

    // decreaseAllowance() function : positive test
    it("Should revert on decrease allowance for second user : Positive check", async function () {
        const oldAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        const result = await gieToken.connect(firstUser).decreaseAllowance(secondUser.address, amount_1);
        await result.wait();
        const newAllowance = await gieToken.allowance(firstUser.address, secondUser.address);
        expect(BigNumber.from(newAllowance)).lt(BigNumber.from(oldAllowance));
    });

    // transferOwnership function : negative test
    it("Should revert on ownership transfer : Caller is not owner", async function () {
        expect(gieToken.connect(secondUser).transferOwnership(zeroAddress)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    // transferOwnership function : negative test
    it("Should revert on ownership transfer : new owner address is zero address", async function () {
        expect(gieToken.connect(firstUser).transferOwnership(zeroAddress)).to.be.revertedWith("AppFees: new owner is the zero address");
    });

    // transferOwnership function : negative test
    it("Should revert on ownership transfer : Already same owner", async function () {
        expect(gieToken.connect(firstUser).transferOwnership(firstUser.address)).to.be.revertedWith("AppFees: Already a owner");
    });

    // transferOwnership function : positive test
    it("Should return owner to be deployer after new owner : Valid inputs", async function () {
        const result = await gieToken.connect(firstUser).transferOwnership(secondUser.address);
        await result.wait();
        expect(await gieToken.owner()).to.equal(secondUser.address);
    });

});