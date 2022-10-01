require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require('@nomiclabs/hardhat-ethers');
require('hardhat-gas-reporter');
require('dotenv').config()
// require("solidity-coverage")
require("@nomicfoundation/hardhat-chai-matchers");
const PRIVATE_KEY = process.env.PRIVATE_KEY  
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY  
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const GOERLI_URL = process.env.GOERLI_URL
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
      compilers: [
        {version: "0.8.17"},
        {version: "0.6.6"},
      ]
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  defaultNetwork: "localhost",
   namedAccounts: {
    deployer:{
      default: 0,  
    },
  

   },
   networks: {
    goerli: {
      url: GOERLI_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConformations: 6,
    }
  }
};
