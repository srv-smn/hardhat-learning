require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();
require('solidity-coverage');

module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    // hardhat: {
    //   allowUnlimitedContractSize: true
    // },
    hardhat: {
      forking: {
        allowUnlimitedContractSize: true,
        url: 'https://polygon-mumbai.g.alchemy.com/v2/TeOORj8Rot5ZX1I5IfZXeLDeoka8SHyF',
      }
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`, `0x${process.env.PRIVATE_KEY_ACCOUNT_2}`],
      chainId: 4,
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000429720
    },
    matic: {
      url: process.env.MUMBAI_TESTNET_RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`, `0x${process.env.PRIVATE_KEY_ACCOUNT_2}`],
      chainId: 80001,
      allowUnlimitedContractSize: true,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  // mocha: {
  //   timeout: 10000000000
  // }
};
