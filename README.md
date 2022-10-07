# GICE

## Description:
 
GICE stands for Global Investment Crypto Exchange. Its a DAO platform which provides the user very reliable and flexible use of crypto assets. Its built on keeping in mind to make crypto world very easy and understandable to each and every person. It provides token swapping, staking, unstaking, rewards claiming, converting fiat currencies to crypto and vice versa. GIE Token holders enjoy the advantage of getting discount on transactions as a benefit.

### Important Points :

- Uses non custodial wallet
- Provides swapping platform using sushiswap protocol
- Supports swapping of Polygon blockchain
- Provides staking, unstaking & reawrds claiming
- Provides fiat to crypto conversion ( using Wyre )
- Provides crypto to fiat conversion ( using Wyre )
- Sending & receiving tokens
- Provides transaction history of all supported tokens
- GIE Token holder enjoys discounts on transactions 

### Techologies Used:

- Hardhat
- Solidity

### List of Libraries/Framework used:

- Mocha
- Chai
- Ethers
- Web3
- Openzepplin
- BigNumber

### Directory layout
       
├── contracts                    
├── docs                    
├── scripts                   
├── test             
└── README.md

### How to install and run :

- Run `npm install` to install all dependencies

- Run `npx hardhat compile` to compile all the contracts

- Run `npx hardhat run scripts/deploy-script.js` to deploy all the contracts

### Run Test Cases :

- Run `npx hardhat test` to execute all the testcases of the contracts
- Run `npx hardhat test test/gie-token-test.js` to execute a GIE token testfile
- Run `npx hardhat test test/token-swap-test.js` to execute a Swap testfile
- Run `npx hardhat test test/app-fees-test.js` to execute a App Fees testfile

### Contracts

| S No. |    Contract Name       |            Mumbai Matic Testnet Address            |
|-------|------------------------|----------------------------------------------------|
|   1   |      TokensSwap        |     0xB3355Ee1027D0ee025C822600E8DC3cDd50c5Ed4     |
|   2   |        AppFees         |     0xb566b9ff918dbAB0CE882E6c1bfa5DA52ec9fc1a     |
|   3   |       GieToken         |     0xC8E00f2c0554838530B5b851D7713378Ff249297     |


| S No. |    Contract Name       |             Polygon Mainnet Address                |
|-------|------------------------|----------------------------------------------------|
|   1   |      TokensSwap        |     0xf68adD490bCa152455436f74394B1FF72BDFb822     |
|   2   |        AppFees         |     0x30eb86b5866DC3D4450662Cc05CF804D95F2F3a0     |
|   3   |       GieToken         |     0xd7A035318d988457A832A256DB68CE3288422bbA     |