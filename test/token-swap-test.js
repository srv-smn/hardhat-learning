const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Swapping of 2 tokens test cases : ", async function () {

    this.timeout(10000000000);

    const daiTokenAddress = "0xcB1e72786A6eb3b44C2a2429e317c8a2462CFeb1";
    const usdtTokenAddress = "0x3813e82e6f7098b9583FC0F33a962D02018B6803";
    const sandTokenAddress = "0xE03489D4E90b22c59c5e23d45DFd59Fc0dB8a025";
    const usdcTokenAddress = "0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7";
    const wMaticAddress = "0x5B67676a984807a212b1c59eBFc9B3568a474F0a";
    const factoryAddress = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";

    const positiveDeadline = Math.floor(new Date().getTime() / 1000.0) + 7200;
    const negativeDeadline = Math.floor(new Date().getTime() / 1000.0) - 60;

    const amount_1 = "10000000";
    const amount_2 = "0";
    const amount_3 = "11304";
    const amount_4 = "758915000000000";
    const amount_5 = "100000000";
    const amount_6 = "1000000000000000000000";
    const amount_7 = "10000000000000000000000";
    const amount_8 = "100000000000000000";
    const amount_9 = "100000000000000";
    const amount_10 = "100000000000000000000000000";
    const amount_12 = "1000";
    const amount_14 = "10000000";
    const amount_15 = "10";
    const amount_16 = "15";
    const amount_17 = "16";
    const amount_18 = "1";
    const amount_19 = "50000000000000000000000";
    const amount_20 = "5";
    const amount_22 = "500000000000000000000000";
    const amount_24 = "25";
    const amount_26 = "100000000000000000000000";
    const amount_27 = "8";
    const amount_28 = "2";
    const amount_30 = "4";
    const emptyString = "";

    const revertMessage_1 = "UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT";
    const revertMessage_2 = "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT";
    const revertMessage_3 = "UniswapV2Library: INSUFFICIENT_LIQUIDITY";
    const revertMessage_4 = "UniswapV2Library: INSUFFICIENT_AMOUNT";
    const revertMessage_7 = "Invalid amount!";
    const revertMessage_8 = "Invalid fees!";
    const revertMessage_9 = "Swap: zero address not allowed for contracts!";
    const revertMessage_10 = "Fee percent should be greater than 0 & less than equal to 100!";
    const revertMessage_11 = "Ownable: caller is not the owner";
    const revertMessage_12 = "Swap: gie app contract is the zero address";
    const revertMessage_13 = "Already a GIE App contract address!";
    const revertMessage_14 = "Swap: gie token contract is the zero address"
    const revertMessage_15 = "Already a GIE Token contract address!"
    const revertMessage_16 = "Swap: new owner is the zero address";
    const revertMessage_17 = "Swap: Already a owner";
    const revertMessage_18 = "Already same fee used!";
    const revertMessage_19 = "tier no. should be between 0 and 5!";
    const revertMessage_20 = "amount & discount should be greater than 0!";
    const revertMessage_21 = "amount & discount must be lesser than next tier & greater than previous tier!";
    const revertMessage_22 = "Already same discount exists!";

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    let firstUser, secondUser, swap, daiToken;

    before(async () => {
        [firstUser, secondUser] = await ethers.getSigners();
        sandToken = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", sandTokenAddress);
        daiToken = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", daiTokenAddress);
        console.log(`Testing  contract with the account: ${firstUser.address}`);
    });

    // Deploy GIE token contract
    it("Should deploy GIE token contract", async function () {
        const GIEToken = await ethers.getContractFactory("GIEToken");
        gieToken = await GIEToken.deploy("GIEToken", "GIE");
        await gieToken.deployed();
        console.log("GIE Token contract deployed at : ", gieToken.address);
    });

    // Deploy AppFees smart contract
    it("Should deploy Donation Smart contract", async function () {
        const AppFees = await ethers.getContractFactory("AppFees");
        appFees = await AppFees.deploy();
        await appFees.deployed();
        console.log("AppFees contract deployed at : ", appFees.address);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid Factory address", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            zeroAddress,
            wMaticAddress,
            appFees.address,
            gieToken.address,
            "15",
            "10"
        )).to.be.revertedWith(revertMessage_9);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid WETH address", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            factoryAddress,
            zeroAddress,
            appFees.address,
            gieToken.address,
            "15",
            "10"
        )).to.be.revertedWith(revertMessage_9);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid Gie app address", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            factoryAddress,
            wMaticAddress,
            zeroAddress,
            gieToken.address,
            "15",
            "10"
        )).to.be.revertedWith(revertMessage_9);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid Gie token address", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            factoryAddress,
            wMaticAddress,
            appFees.address,
            zeroAddress,
            "15",
            "10"
        )).to.be.revertedWith(revertMessage_9);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid fee percent numerator", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            factoryAddress,
            wMaticAddress,
            appFees.address,
            gieToken.address,
            amount_2,
            "10"
        )).to.be.revertedWith(revertMessage_8);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid fee percent denominator", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            factoryAddress,
            wMaticAddress,
            appFees.address,
            gieToken.address,
            "15",
            amount_2
        )).to.be.revertedWith(revertMessage_8);
    });

    // Deploy TokensSwap smart contract
    it("Should revert on deploy Swap contract : Invalid fee percent greater than 100", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        await expect(Swap.deploy(
            factoryAddress,
            wMaticAddress,
            appFees.address,
            gieToken.address,
            amount_12,
            amount_18
        )).to.be.revertedWith(revertMessage_10);
    });

    // Deploy TokensSwap contract
    it("Should deploy Swap contract : Valid inputs", async function () {
        const Swap = await ethers.getContractFactory("TokensSwap");
        swap = await Swap.deploy(
            factoryAddress,
            wMaticAddress,
            daiTokenAddress,
            sandTokenAddress,
            amount_16,
            amount_15
        );
        await swap.deployed();
        console.log("Swap contract deployed at : ", swap.address);
    });

    // setGieAppContract() function : negative test 
    it("Should revert on setting gie app contract : Caller is not owner", async function () {
        await expect(swap.connect(secondUser).setGieAppContract(appFees.address)).to.be.revertedWith(revertMessage_11);
    });

    // setGieAppContract() function : negative test 
    it("Should revert on setting gie app contract : Invalid contract address", async function () {
        await expect(swap.connect(firstUser).setGieAppContract(zeroAddress)).to.be.revertedWith(revertMessage_12);
    });

    // setGieAppContract() function : negative test 
    it("Should revert on setting gie app contract : Already same contract address", async function () {
        await expect(swap.connect(firstUser).setGieAppContract(daiTokenAddress)).to.be.revertedWith(revertMessage_13);
    });

    // setGieAppContract() function : positive test 
    it("Should set gie contract address : Valid inputs", async function () {
        const result = await swap.connect(firstUser).setGieAppContract(appFees.address);
        await result.wait();
        const newAddress = await swap.gieAppContract();
        expect(newAddress).to.equal(appFees.address);
    });

    // setGieTokenContract() function : negative test 
    it("Should revert on setting gie token contract : Caller is not owner", async function () {
        await expect(swap.connect(secondUser).setGieTokenContract(gieToken.address)).to.be.revertedWith(revertMessage_11);
    });

    // setGieTokenContract() function : negative test 
    it("Should revert on setting gie token contract : Invalid contract address", async function () {
        await expect(swap.connect(firstUser).setGieTokenContract(zeroAddress)).to.be.revertedWith(revertMessage_14);
    });

    // setGieTokenContract() function : negative test 
    it("Should revert on setting gie token contract : Already same contract address", async function () {
        await expect(swap.connect(firstUser).setGieTokenContract(sandTokenAddress)).to.be.revertedWith(revertMessage_15);
    });

    // setGieTokenContract() function : positive test 
    it("Should set gie token contract address : Valid inputs", async function () {
        const result = await swap.connect(firstUser).setGieTokenContract(gieToken.address);
        await result.wait();
        const newAddress = await swap.gieTokenContract();
        expect(newAddress).to.equal(gieToken.address);
    });

    // transferOwnership function : negative test
    it("Should revert on ownership transfer : Caller is not owner", async function () {
        expect(swap.connect(secondUser).transferOwnership(zeroAddress)).to.be.revertedWith(revertMessage_11);
    });

    // transferOwnership function : negative test
    it("Should revert on ownership transfer : Invalid address", async function () {
        expect(swap.connect(firstUser).transferOwnership(zeroAddress)).to.be.revertedWith(revertMessage_16);
    });

    // transferOwnership function : negative test
    it("Should revert on ownership transfer : Already a owner", async function () {
        expect(swap.connect(firstUser).transferOwnership(firstUser.address)).to.be.revertedWith(revertMessage_17);
    });

    // transferOwnership function : positive test
    it("Should update new owner : Valid inputs", async function () {
        const result = await swap.connect(firstUser).transferOwnership(secondUser.address);
        await result.wait();
        expect(await swap.owner()).to.equal(secondUser.address);
    });

    // transferOwnership function : positive test
    it("Should set new owner back to original owner : Valid inputs", async function () {
        const result = await swap.connect(secondUser).transferOwnership(firstUser.address);
        await result.wait();
        expect(await swap.owner()).to.equal(firstUser.address);
    });

    // setGieAppFees() function : negative test 
    it("Should revert on setting gie app fees : Caller is not owner", async function () {
        await expect(swap.connect(secondUser).setGieAppFees(amount_16, amount_15)).to.be.revertedWith(revertMessage_11);
    });

    // setGieAppFees() function : negative test 
    it("Should revert on setting gie app fees : Invalid numerator", async function () {
        await expect(swap.connect(firstUser).setGieAppFees(amount_2, amount_15)).to.be.revertedWith(revertMessage_8);
    });

    // setGieAppFees() function : negative test 
    it("Should revert on setting gie app fees : Invalid denominator", async function () {
        await expect(swap.connect(firstUser).setGieAppFees(amount_15, amount_2)).to.be.revertedWith(revertMessage_8);
    });

    // setGieAppFees() function : negative test 
    it("Should revert on setting gie app fees : Percent greater than 100", async function () {
        await expect(swap.connect(firstUser).setGieAppFees(amount_12, amount_18)).to.be.revertedWith(revertMessage_10);
    });

    // setGieAppFees() function : negative test 
    it("Should revert on setting gie app fees : Already same value", async function () {
        await expect(swap.connect(firstUser).setGieAppFees(amount_16, amount_15)).to.be.revertedWith(revertMessage_18);
    });

    // setGieAppFees() function : positive test 
    it("Should set gie app fees : Valid inputs", async function () {
        const result = await swap.connect(firstUser).setGieAppFees(amount_17, amount_15);
        await result.wait();
        const newFees = await swap.gieAppFees();
        const newFeesDecimals = await swap.gieAppFeesDecimals();
        expect(newFees).to.equal(amount_17);
        expect(newFeesDecimals).to.equal(amount_15);
    });

    // allTiers() function : positive test 
    it("Should return all tiers : Valid inputs", async function () {
        const tiers = [1, 2, 3, 4];
        const result = await swap.allTiers();
        expect(tiers.length === result.length && tiers.every((value, index) => value === result[index]));
    });

    // calculateFeesForTransaction() function : negative test 
    it("Should revert on calculating fees : Invalid input amount", async function () {
        await expect(swap.calculateFeesForTransaction(firstUser.address, amount_2)).to.be.revertedWith(revertMessage_7);
    });

    // calculateFeesForTransaction() function : positive test 
    it("Should return calculated fees : Valid input", async function () {
        const result = await swap.calculateFeesForTransaction(firstUser.address, amount_5);
        expect(BigNumber.from(result)).gt(BigNumber.from(amount_2));
    });

    // calculateDiscountPercent() function : positive test 
    it("Should return calculated discount percent greater than 0 : Valid input", async function () {
        const result = await swap.calculateDiscountPercent(firstUser.address);
        expect(BigNumber.from(result)).gt(BigNumber.from(amount_2));
    });

    // calculateDiscountPercent() function : positive test 
    it("Should return calculated discount percent equal to 0 : Valid input", async function () {
        const result = await swap.calculateDiscountPercent(secondUser.address);
        expect(BigNumber.from(result)).eq(BigNumber.from(amount_2));
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : Not a owner", async function () {
        expect(swap.connect(secondUser).updateDiscount(amount_18, amount_19, amount_20)).to.be.revertedWith(revertMessage_11);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : Invalid tier", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_2, amount_19, amount_20)).to.be.revertedWith(revertMessage_19);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : Invalid amount", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_18, amount_2, amount_20)).to.be.revertedWith(revertMessage_20);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : Invalid discount percentage", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_18, amount_19, amount_2)).to.be.revertedWith(revertMessage_20);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : amount greater than limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_18, amount_22, amount_20)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : discount greater than limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_18, amount_19, amount_24)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 1 : discount already exists", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_18, amount_19, amount_20)).to.be.revertedWith(revertMessage_22);
    });

    // updateDiscount() function : positive test 
    it("Should update discount for tier 1 : Valid inputs", async function () {
        const result = await swap.connect(firstUser).updateDiscount(amount_18, amount_26, amount_27);
        await result.wait();
        const updatedRate = await swap.discountRates(0);
        expect(updatedRate.amount).equal(amount_26);
        expect(updatedRate.discountPercent).equal(Number(amount_27));
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 4 : amount lesser than limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_30, amount_22, amount_20)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 4 : discount lesser than limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_30, amount_19, amount_24)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 2 : amount lesser than lower limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_28, amount_26, amount_20)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 2 : discount lesser than lower limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_28, amount_22, amount_27)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 2 : amount greater than higher limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_28, amount_22, amount_20)).to.be.revertedWith(revertMessage_21);
    });

    // updateDiscount() function : negative test 
    it("Should revert on update discount for tier 2 : discount greater than higher limit", async function () {
        expect(swap.connect(firstUser).updateDiscount(amount_28, amount_19, amount_24)).to.be.revertedWith(revertMessage_21);
    });

    // getReserves() function : positive test 
    it("Should return valid reserves of SAND & WMATIC tokens : Valid inputs", async function () {
        const result = await swap.getReserves(sandTokenAddress, wMaticAddress);
        expect(BigNumber.from(result[0])).gt(BigNumber.from(amount_2));
        expect(BigNumber.from(result[1])).gt(BigNumber.from(amount_2));
    });

    // getReserves() function : negative test 
    it("Should revert for not existing reserves pair of USDC & DAI tokens : Invalid pair", async function () {
        await expect(swap.getReserves(daiTokenAddress, usdcTokenAddress)).to.be.revertedWith(emptyString);
    });

    // getReserves() function : negative test 
    it("Should revert for not existing reserves pair of USDC & DAI tokens : Invalid pair", async function () {
        await expect(swap.getReserves(usdcTokenAddress, daiTokenAddress)).to.be.revertedWith(emptyString);
    });

    // getAmountsIn() function : positive test 
    it("Should return amount to be given in for swapping of tokens : Valid inputs", async function () {
        const result = await swap.getAmountsIn(amount_8, [wMaticAddress, sandTokenAddress]);
        expect(BigNumber.from(result[0])).gt(BigNumber.from(amount_2));
        expect(BigNumber.from(result[1])).gt(BigNumber.from(amount_2));
    });

    // getAmountsIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid amount out", async function () {
        await expect(swap.getAmountsIn(amount_2, [wMaticAddress, sandTokenAddress])).to.be.revertedWith(revertMessage_1);
    });

    // getAmountsIn() function : negative test 
    it("Should revert for amount to be given in for non existing token pair : Invalid pair", async function () {
        await expect(swap.getAmountsIn(amount_8, [daiTokenAddress, sandTokenAddress])).to.be.revertedWith(emptyString);
    });

    // getAmountsOut() function : positive test 
    it("Should return amount to get as result for swapping of tokens : Valid inputs", async function () {
        const result = await swap.getAmountsOut(amount_6, [wMaticAddress, sandTokenAddress]);
        expect(BigNumber.from(result[0])).gt(BigNumber.from(amount_2));
        expect(BigNumber.from(result[1])).gt(BigNumber.from(amount_2));
    });

    // getAmountsOut() function : negative test 
    it("Should revert for amount to get as result for swapping of tokens : Invalid amount in", async function () {
        await expect(swap.getAmountsOut(amount_2, [wMaticAddress, sandTokenAddress])).to.be.revertedWith(revertMessage_2);
    });

    // getAmountsOut() function : negative test 
    it("Should revert for amount to get as result for non existing token pair : Invalid pair", async function () {
        await expect(swap.getAmountsOut(amount_8, [daiTokenAddress, sandTokenAddress])).to.be.revertedWith(emptyString);
    });

    // getAmountIn() function : positive test 
    it("Should return amount to be given in for swapping of tokens : Valid inputs", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        const result = await swap.getAmountIn(amount_8, reserves[0], reserves[1]);
        expect(BigNumber.from(result)).gt(BigNumber.from(amount_2));
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid amount out", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountIn(amount_2, reserves[0], reserves[1])).to.be.revertedWith(revertMessage_1);
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid first reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountIn(amount_8, amount_2, reserves[1])).to.be.revertedWith(revertMessage_3);
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid second reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountIn(amount_8, reserves[0], amount_2)).to.be.revertedWith(revertMessage_3);
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid both reserves", async function () {
        await expect(swap.getAmountIn(amount_8, amount_2, amount_2)).to.be.revertedWith(revertMessage_3);
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid first reserves & amount out 0", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountIn(amount_2, amount_2, reserves[1])).to.be.revertedWith(revertMessage_1);
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : Invalid second reserves & amount out 0", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountIn(amount_2, reserves[0], amount_2)).to.be.revertedWith(revertMessage_1);
    });

    // getAmountIn() function : negative test 
    it("Should revert for amount to be given in for swapping of tokens : All parameters invalid", async function () {
        await expect(swap.getAmountIn(amount_2, amount_2, amount_2)).to.be.revertedWith(revertMessage_1);
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : Invalid amount in", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountOut(amount_2, reserves[0], reserves[1])).to.be.revertedWith(revertMessage_2);
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : Invalid first reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountOut(amount_8, amount_2, reserves[1])).to.be.revertedWith(revertMessage_3);
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : Invalid second reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountOut(amount_8, reserves[0], amount_2)).to.be.revertedWith(revertMessage_3);
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : All parameters invalid ", async function () {
        await expect(swap.getAmountOut(amount_2, amount_2, amount_2)).to.be.revertedWith(revertMessage_2);
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : Invalid first reserve and amount in", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        expect(swap.getAmountOut(amount_2, amount_2, reserves[1])).to.be.revertedWith(revertMessage_2);
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : Invalid second reserve and amount in", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.getAmountOut(amount_2, reserves[0], amount_2)).to.be.reverted
    });

    // getAmountOut() function : negative test 
    it("Should revert amount to be expected as result for swapping of tokens : Invalid both reserves", async function () {
        await expect(swap.getAmountOut(amount_8, amount_2, amount_2)).to.be.revertedWith(revertMessage_3);
    });

    // getAmountOut() function : positive test 
    it("Should return amount to be expected as result for swapping of tokens : Valid inputs", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        const result = await swap.getAmountOut(amount_8, reserves[0], reserves[1]);
        expect(BigNumber.from(result)).gt(BigNumber.from(amount_2));
    });

    // quote() function : positive test 
    it("Should give amount in return as result for swapping of tokens : Valid inputs", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        const result = await swap.quote(amount_8, reserves[0], reserves[1]);
        expect(BigNumber.from(result)).gt(BigNumber.from(amount_2));
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : Invalid amount in", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.quote(amount_2, reserves[0], reserves[1])).to.be.revertedWith(revertMessage_4);
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : Invalid first reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.quote(amount_8, amount_2, reserves[1])).to.be.revertedWith(revertMessage_3);
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : Invalid second reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.quote(amount_8, reserves[0], amount_2)).to.be.revertedWith(revertMessage_3);
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : All invalid parameters", async function () {
        await expect(swap.quote(amount_2, amount_2, amount_2)).to.be.revertedWith(revertMessage_4);
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : Invalid amount In & first reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.quote(amount_2, amount_2, reserves[1])).to.be.revertedWith(revertMessage_4);
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : Invalid amount In & second reserve", async function () {
        const reserves = await swap.getReserves(wMaticAddress, sandTokenAddress);
        await expect(swap.quote(amount_2, reserves[0], amount_2)).to.be.revertedWith(revertMessage_4);
    });

    // quote() function : negative test 
    it("Should revert given amount in return as result for swapping of tokens : Invalid first & second reserve", async function () {
        await expect(swap.quote(amount_8, amount_2, amount_2)).to.be.revertedWith(revertMessage_3);
    });

    // swapETHForExactTokens() function : positive test 
    it("Should swap MATIC to SAND token providing output amount : Valid inputs", async function () {
        const amountIn = await swap.getAmountsIn(amount_8, [wMaticAddress, sandTokenAddress]);
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const totalFees = BigNumber.from(amountIn[0]).add(BigNumber.from(feesInEth));

        const gasLimit = await swap.connect(firstUser).estimateGas.swapETHForExactTokens(
            amountIn[0],
            amount_8,
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: totalFees }
        );

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2)
        );

        const result = await swap.connect(firstUser).swapETHForExactTokens(
            amountIn[0],
            amount_8,
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: totalFees,
                gasLimit: bufferedGasLimit
            }
        );

        const receipt = await result.wait();
        const events = receipt.events?.filter((x) => { return x.event == "FeesPaid" });
        expect(events[0].event).to.be.equal("FeesPaid");
    });

    // swapETHForExactTokens() function : negative test 
    it("Should revert swap of MATIC to SAND token providing output amount : Slippage error", async function () {
        const amountIn = await swap.getAmountsIn(amount_8, [wMaticAddress, sandTokenAddress]);
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const totalFees = BigNumber.from(amountIn[0]).add(BigNumber.from(feesInEth));

        expect(swap.connect(firstUser).swapETHForExactTokens(
            amountIn[0],
            amount_8,
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: totalFees.sub("200")
            }
        )).to.be.reverted;
    });

    // swapExactTokensForTokens() function : positive test 
    it("Should swap DAI to SAND token providing input amount : Valid inputs", async function () {
        const approved = await daiToken.connect(firstUser).approve(swap.address, amount_14);
        await approved.wait();
        const amountOut = await swap.getAmountsOut(amount_14, [daiTokenAddress, wMaticAddress, sandTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_14);
        const feesInEther = await swap.getAmountsOut(feesInDai, [daiTokenAddress, wMaticAddress]);

        const gasLimit = await swap.connect(firstUser).estimateGas.swapExactTokensForTokens(
            amount_14,
            amountOut[1],
            [daiTokenAddress, wMaticAddress, sandTokenAddress],
            [daiTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        );

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2)
        );

        const result = await swap.connect(firstUser).swapExactTokensForTokens(
            amount_14,
            amountOut[1],
            [daiTokenAddress, wMaticAddress, sandTokenAddress],
            [daiTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInEther[1],
                gasLimit: bufferedGasLimit
            }
        );

        const receipt = await result.wait();
        const events = receipt.events?.filter((x) => { return x.event == "FeesPaid" });
        expect(events[0].event).to.be.equal("FeesPaid");
    });

    // swapExactTokensForTokens() function : negative test 
    it("Should revert on swap of DAI to SAND token providing input amount : Slippage error", async function () {
        const approved = await daiToken.connect(firstUser).approve(swap.address, amount_14);
        await approved.wait();
        const amountOut = await swap.getAmountsOut(amount_14, [daiTokenAddress, wMaticAddress, sandTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_14);
        const feesInEther = await swap.getAmountsOut(feesInDai, [daiTokenAddress, wMaticAddress]);

        expect(swap.connect(firstUser).swapExactTokensForTokens(
            amount_14,
            amountOut[1],
            [daiTokenAddress, wMaticAddress, sandTokenAddress],
            [daiTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInEther[1].sub("200")
            }
        )).to.be.reverted;
    });

    // swapExactTokensForTokens() function : negative test 
    it("Should revert on swap SAND to USDT token providing input amount : Invalid deadline", async function () {
        const amountOut = await swap.getAmountsOut(amount_6, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_6);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);
        await expect(swap.swapExactTokensForTokens(
            amount_6,
            amountOut[1],
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            negativeDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapExactTokensForTokens() function : negative test 
    it("Should revert on swap SAND to USDT token providing input amount : Dai not approved", async function () {
        const amountOut = await swap.getAmountsOut(amount_6, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_6);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);
        await expect(swap.swapExactTokensForTokens(
            amount_6,
            amountOut[1],
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapExactTokensForTokens() function : negative test 
    it("Should revert on swap SAND to USDT token providing input amount : Invalid amount in", async function () {
        await expect(swap.swapExactTokensForTokens(
            amount_2,
            amount_8,
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapExactTokensForTokens() function : negative test 
    it("Should revert on swap SAND to USDT token providing input amount : Invalid token pair", async function () {
        await expect(swap.swapExactTokensForTokens(
            amount_6,
            amount_8,
            [sandTokenAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapExactTokensForTokens() function : negative test 
    it("Should revert on swap SAND to USDT token providing input amount : Invalid WETH pair", async function () {
        const amountOut = await swap.getAmountsOut(amount_6, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_6);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);
        await expect(swap.swapExactTokensForTokens(
            amount_6,
            amountOut[1],
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [zeroAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapExactETHForTokens() function : positive test 
    it("Should swap MATIC to SAND token providing input amount : Valid inputs", async function () {
        const amountOut = await swap.getAmountsOut(amount_8, [wMaticAddress, sandTokenAddress]);
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amount_8);
        const totalFeeInEth = BigNumber.from(feesInEth).add(BigNumber.from(amount_8));
        const gasLimit = await swap.connect(firstUser).estimateGas.swapExactETHForTokens(
            amount_8,
            amountOut[1],
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: totalFeeInEth }
        );
        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2)
        );
        const result = await swap.connect(firstUser).swapExactETHForTokens(
            amount_8,
            amountOut[1],
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: totalFeeInEth,
                gasLimit: bufferedGasLimit
            }
        );
        const receipt = await result.wait();
        const events = receipt.events?.filter((x) => { return x.event == "FeesPaid" });
        expect(events[0].event).to.be.equal("FeesPaid");
    });

    // swapExactETHForTokens() function : negative test 
    it("Should revert on swap of MATIC to SAND token providing input amount : Slippage error", async function () {
        const amountOut = await swap.getAmountsOut(amount_8, [wMaticAddress, sandTokenAddress]);
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amount_8);
        const totalFeeInEth = BigNumber.from(feesInEth).add(BigNumber.from(amount_8));

        expect(swap.connect(firstUser).swapExactETHForTokens(
            amount_8,
            amountOut[1],
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: totalFeeInEth.sub("200")
            }
        )).to.be.reverted;
    });

    // swapExactETHForTokens() function : negative test 
    it("Should revert swap MATIC to SAND token providing input amount : Invalid deadline", async function () {
        const amountOut = await swap.getAmountsOut(amount_9, [wMaticAddress, sandTokenAddress]);
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amount_9);
        const totalFeeInEth = BigNumber.from(feesInEth).add(BigNumber.from(amount_9));
        await expect(swap.connect(firstUser).swapExactETHForTokens(
            amount_9,
            amountOut[1],
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            negativeDeadline,
            { value: totalFeeInEth }
        )).to.be.reverted;
    });

    // swapExactETHForTokens() function : negative test 
    it("Should revert swap Eth to Dai token providing input amount : Invalid amount in", async function () {
        expect(swap.connect(firstUser).swapExactETHForTokens(
            amount_2,
            amount_5,
            [wMaticAddress, sandTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_2 }
        )).to.be.reverted;
    });

    // swapExactETHForTokens() function : negative test 
    it("Should revert swap DAI to USDC token providing input amount : Invalid token pair", async function () {
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amount_9);
        const totalFeeInEth = BigNumber.from(feesInEth).add(BigNumber.from(amount_9));
        await expect(swap.connect(firstUser).swapExactETHForTokens(
            amount_9,
            amount_10,
            [daiTokenAddress, usdcTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: totalFeeInEth }
        )).to.be.reverted;
    });

    // swapTokensForExactTokens() function : positive test 
    it("Should swap DAI to USDT token providing output amount : Valid inputs", async function () {
        const amountIn = await swap.getAmountsIn(amount_3, [daiTokenAddress, wMaticAddress, usdtTokenAddress]);
        const approved = await daiToken.connect(firstUser).approve(swap.address, amountIn[0]);
        await approved.wait();
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const feesInEther = await swap.getAmountsOut(feesInDai, [daiTokenAddress, wMaticAddress]);

        const gasLimit = await swap.estimateGas.swapTokensForExactTokens(
            amount_3,
            amountIn[0],
            [daiTokenAddress, wMaticAddress, usdtTokenAddress],
            [daiTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        );

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2)
        );

        const result = await swap.swapTokensForExactTokens(
            amount_3,
            amountIn[0],
            [daiTokenAddress, wMaticAddress, usdtTokenAddress],
            [daiTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInEther[1],
                gasLimit: bufferedGasLimit
            }
        );

        const receipt = await result.wait();
        const events = receipt.events?.filter((x) => { return x.event == "FeesPaid" });
        expect(events[0].event).to.be.equal("FeesPaid");
    });

    // swapTokensForExactTokens() function : negative test 
    it("Should revert on swap of DAI to USDT token providing output amount : Slippage error", async function () {
        const amountIn = await swap.getAmountsIn(amount_3, [daiTokenAddress, wMaticAddress, usdtTokenAddress]);
        const approved = await daiToken.connect(firstUser).approve(swap.address, amountIn[0]);
        await approved.wait();
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const feesInEther = await swap.getAmountsOut(feesInDai, [daiTokenAddress, wMaticAddress]);

        expect(swap.swapTokensForExactTokens(
            amount_3,
            amountIn[0],
            [daiTokenAddress, wMaticAddress, usdtTokenAddress],
            [daiTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInEther[1].sub("200")
            }
        )).to.be.reverted;
    });

    // swapTokensForExactTokens() function : negative test 
    it("Should revert SAND to USDT token providing output amount : Invalid deadline", async function () {
        // const amountIn = await swap.getAmountsIn(amount_5, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        await expect(swap.swapTokensForExactTokens(
            amount_5,
            amount_8,
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            negativeDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapTokensForExactTokens() function : negative test 
    it("Should swap SAND to USDT token providing output amount : Invalid amount in", async function () {
        await expect(swap.swapTokensForExactTokens(
            amount_5,
            amount_2,
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapTokensForExactTokens() function : negative test 
    it("Should swap Dai to cZRX token providing output amount : Invalid token pair", async function () {
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_5);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        await expect(swap.swapTokensForExactTokens(
            amount_5,
            amount_12,
            [sandTokenAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapTokensForExactTokens() function : negative test 
    it("Should swap SAND to USDT token providing output amount : SAND not approved", async function () {
        const amountIn = await swap.getAmountsIn(amount_3, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);
        await expect(swap.swapTokensForExactTokens(
            amount_3,
            amountIn[0],
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapTokensForExactTokens() function : negative test 
    it("Should swap SAND to USDT token providing output amount : Invalid WETH path", async function () {
        const amountIn = await swap.getAmountsIn(amount_3, [sandTokenAddress, wMaticAddress, usdtTokenAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);
        await expect(swap.swapTokensForExactTokens(
            amount_3,
            amountIn[0],
            [sandTokenAddress, wMaticAddress, usdtTokenAddress],
            [sandTokenAddress, usdcTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapExactTokensForETH() function : positive test 
    it("Should swap Sand to MATIC token providing input amount : Valid inputs", async function () {
        const amountOut = await swap.getAmountsOut(amount_3, [sandTokenAddress, wMaticAddress]);
        const approved = await sandToken.connect(firstUser).approve(swap.address, amount_3);
        await approved.wait();
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_3);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);

        const gasLimit = await swap.connect(firstUser).estimateGas.swapExactTokensForETH(
            amount_3,
            amountOut[1],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        );

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2)
        );

        const result = await swap.connect(firstUser).swapExactTokensForETH(
            amount_3,
            amountOut[1],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInEther[1],
                gasLimit: bufferedGasLimit
            }
        );

        const receipt = await result.wait();
        const events = receipt.events?.filter((x) => { return x.event == "FeesPaid" });
        expect(events[0].event).to.be.equal("FeesPaid");
    });

    // swapExactTokensForETH() function : negative test 
    it("Should revert on swap of Sand to MATIC token providing input amount : Slippage error", async function () {
        const amountOut = await swap.getAmountsOut(amount_3, [sandTokenAddress, wMaticAddress]);
        const approved = await sandToken.connect(firstUser).approve(swap.address, amount_3);
        await approved.wait();
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_3);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);

        expect(swap.connect(firstUser).swapExactTokensForETH(
            amount_3,
            amountOut[1],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInEther[1].sub("200")
            }
        )).to.be.reverted
    });

    // swapExactTokensForETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing input amount : Invalid deadline", async function () {
        const amountOut = await swap.getAmountsOut(amount_7, [sandTokenAddress, wMaticAddress]);
        await expect(swap.connect(firstUser).swapExactTokensForETH(
            amount_7,
            amountOut[1],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            negativeDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapExactTokensForETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing input amount : Invalid amount in", async function () {
        await expect(swap.connect(firstUser).swapExactTokensForETH(
            amount_2,
            amount_8,
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapExactTokensForETH() function : negative test 
    it("Should revert swap USDT to MATIC token providing input amount : Invalid token pair", async function () {
        await expect(swap.connect(firstUser).swapExactTokensForETH(
            amount_7,
            amount_8,
            [usdcTokenAddress, usdtTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapExactTokensForETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing input amount : Approval not provided", async function () {
        const amountOut = await swap.getAmountsOut(amount_7, [sandTokenAddress, wMaticAddress]);
        const feesInDai = await swap.calculateFeesForTransaction(firstUser.address, amount_7);
        const feesInEther = await swap.getAmountsOut(feesInDai, [sandTokenAddress, wMaticAddress]);
        await expect(swap.connect(firstUser).swapExactTokensForETH(
            amount_7,
            amountOut[1],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInEther[1] }
        )).to.be.reverted;
    });

    // swapTokensForExactETH() function : positive test 
    it("Should swap SAND to MATIC token providing output amount : Valid inputs", async function () {
        const amountIn = await swap.getAmountsIn(amount_3, [sandTokenAddress, wMaticAddress]);
        const approved = await sandToken.connect(firstUser).approve(swap.address, amountIn[0]);
        await approved.wait();
        const feesInMatic = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);

        const gasLimit = await swap.connect(firstUser).estimateGas.swapTokensForExactETH(
            amount_3,
            amountIn[0],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: feesInMatic }
        );

        const bufferedGasLimit = Math.round(
            Number(gasLimit) + Number(gasLimit) * Number(0.2)
        );

        const result = await swap.connect(firstUser).swapTokensForExactETH(
            amount_3,
            amountIn[0],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInMatic,
                gasLimit: bufferedGasLimit
            }
        );

        const receipt = await result.wait();
        const events = receipt.events?.filter((x) => { return x.event == "FeesPaid" });
        expect(events[0].event).to.be.equal("FeesPaid");
    });

    // swapTokensForExactETH() function : negative test 
    it("Should revert on swap of SAND to MATIC token providing output amount : Slippage error", async function () {
        const amountIn = await swap.getAmountsIn(amount_3, [sandTokenAddress, wMaticAddress]);
        const approved = await sandToken.connect(firstUser).approve(swap.address, amountIn[0]);
        await approved.wait();
        const feesInMatic = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);

        expect(swap.connect(firstUser).swapTokensForExactETH(
            amount_3,
            amountIn[0],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            {
                value: feesInMatic.sub("200")
            }
        )).to.be.reverted;
    });

    // swapTokensForExactETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing output amount : Invalid deadline", async function () {
        const amountIn = await swap.getAmountsIn(amount_4, [sandTokenAddress, wMaticAddress]);
        await expect(swap.connect(firstUser).swapTokensForExactETH(
            amount_4,
            amountIn[0],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            negativeDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapTokensForExactETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing output amount : Invalid amount in", async function () {
        await expect(swap.connect(firstUser).swapTokensForExactETH(
            amount_4,
            amount_2,
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            negativeDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapTokensForExactETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing output amount : Invalid token pair", async function () {
        await expect(swap.connect(firstUser).swapTokensForExactETH(
            amount_3,
            amount_12,
            [usdcTokenAddress, usdtTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapTokensForExactETH() function : negative test 
    it("Should revert swap SAND to MATIC token providing output amount : Approval not provided", async function () {
        const amountIn = await swap.getAmountsIn(amount_4, [sandTokenAddress, wMaticAddress]);
        await expect(swap.connect(firstUser).swapTokensForExactETH(
            amount_4,
            amountIn[0],
            [sandTokenAddress, wMaticAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_12 }
        )).to.be.reverted;
    });

    // swapETHForExactTokens() function : negative test 
    it("Should revert swap MATIC to SAND token providing output amount : Invalid deadline", async function () {
        const amountIn = await swap.getAmountsIn(amount_8, [wMaticAddress, sandTokenAddress]);
        const feesInEth = await swap.calculateFeesForTransaction(firstUser.address, amountIn[0]);
        const totalFees = BigNumber.from(amountIn[0]).add(BigNumber.from(feesInEth));
        await expect(swap.connect(firstUser).swapETHForExactTokens(
            amountIn[0],
            amount_9,
            [wMaticAddress, daiTokenAddress],
            firstUser.address,
            negativeDeadline,
            { value: totalFees }
        )).to.be.reverted;
    });

    // swapETHForExactTokens() function : negative test 
    it("Should revert swap MATIC to SAND token providing output amount : Invalid amount in", async function () {
        await expect(swap.connect(firstUser).swapETHForExactTokens(
            amount_2,
            amount_9,
            [wMaticAddress, daiTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_2 }
        )).to.be.reverted;
    });

    // swapETHForExactTokens() function : negative test 
    it("Should revert swap MATIC to SAND token providing output amount : Invalid token pair", async function () {
        await expect(swap.connect(firstUser).swapETHForExactTokens(
            amount_1,
            amount_9,
            [daiTokenAddress, usdcTokenAddress],
            firstUser.address,
            positiveDeadline,
            { value: amount_9 }
        )).to.be.reverted;
    });

});