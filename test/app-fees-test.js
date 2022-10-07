const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("AppFees contract test cases : ", async function () {

  let firstUser, secondUser, appFees;
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  before(async () => {
    [firstUser, secondUser] = await ethers.getSigners();
    console.log(`Testing contract with the account: ${firstUser.address}`);
  });

  // Deploy AppFees smart contract
  it("Should deploy Donation Smart contract", async function () {
    const AppFees = await ethers.getContractFactory("AppFees");
    appFees = await AppFees.deploy();
    await appFees.deployed();
    console.log("AppFees contract deployed at : ", appFees.address);
  });

  // owner variable : negative test
  it("Should check not a correct owner : Valid inputs", async function () {
    const owner = await appFees.owner();
    expect(owner).to.be.not.equal(secondUser.address);
  });

  // owner variable : positive test
  it("Should return owner to be deployer : Valid inputs", async function () {
    const owner = await appFees.owner();
    expect(owner).to.equal(appFees.signer.address);
  });

  // totalFeesCollected variable : positive test
  it("Should return owner to be deployer : Valid inputs", async function () {
    const totalFeesCollected = await appFees.totalFeesCollected();
    expect(totalFeesCollected).to.equal(0);
  });

  // getBalance function : positive test
  it("Should return owner to be deployer : Valid inputs", async function () {
    const getBalance = await appFees.getBalance();
    expect(getBalance).to.equal(0);
  });

  // transfer function : negative test
  it("Should revert on transfer function due to zero address: Invalid inputs", async function () {
    await expect(appFees.transfer(zeroAddress, "0")).to.be.revertedWith("INVALID_BENEFICIARY");
  });

  // transfer function : negative test
  it("Should revert on transfer function due to invalid amount: Invalid inputs", async function () {
    await expect(appFees.transfer(secondUser.address, 0)).to.be.revertedWith("INVALID_AMOUNT");
  });

  // transfer function : negative test
  it("Should revert on transfer function due to insufficient balance: Invalid inputs", async function () {
    const balance = await appFees.getBalance();
    await expect(appFees.transfer(
      firstUser.address,
      BigNumber.from("1").add(balance)
    )).to.be.revertedWith("INSUCCIFIENT_BALANCE");
  });

  // receive function : positive test
  it("Should receive ETH in contract", async function () {
    const result = await firstUser.sendTransaction({ to: appFees.address, value: "1000000000" });
    const receipt = await result.wait();
    expect(receipt);
  });

  // transfer function : positive test
  it("Should transfer amount : Valid inputs", async function () {
    const result = await appFees.connect(firstUser).transfer(secondUser.address, "100000000");
    const receipt = await result.wait();
    const events = receipt.events?.filter((x) => { return x.event == "Transfer" });
    expect(events[0].event).to.be.equal("Transfer");
  });

  // transferOwnership function : negative test
  it("Should revert on ownership transfer : Invalid inputs", async function () {
    expect(appFees.connect(secondUser).transferOwnership(zeroAddress)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // transferOwnership function : negative test
  it("Should revert on ownership transfer : Invalid inputs", async function () {
    expect(appFees.connect(firstUser).transferOwnership(zeroAddress)).to.be.revertedWith("AppFees: new owner is the zero address");
  });

  // transferOwnership function : negative test
  it("Should revert on ownership transfer : Invalid inputs", async function () {
    expect(appFees.connect(firstUser).transferOwnership(firstUser.address)).to.be.revertedWith("AppFees: Already a owner");
  });

  // transferOwnership function : positive test
  it("Should return owner to be deployer after new owner : Valid inputs", async function () {
    const result = await appFees.connect(firstUser).transferOwnership(secondUser.address);
    await result.wait();
    expect(await appFees.owner()).to.equal(secondUser.address);
  });

});
