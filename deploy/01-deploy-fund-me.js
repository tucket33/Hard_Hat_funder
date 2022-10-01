
// option 1 design
// function deployFunc(){
//     console.log("yo")
// }
// module.exports.default = deployFunc
//
// option 2 patricks preference

const { verify } = require("../utils/verify");
const { devChains, networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { deployments } = require("hardhat");
require('dotenv').config()


module.exports = async ({getNamedAccounts, deployments}) => { // hre = hardhat runtime env (its an object)
    const {deploy, log} = deployments; // unpacking functions
    const {deployer} = await getNamedAccounts() // unpacking accounts: the default is set in config
    const chainId = network.config.chainId;
    //
    // const ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeed"];
    let ethUsdPriceFeedAddr;
    if(devChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator") 
        ethUsdPriceFeedAddr = ethUsdAggregator.address } else{
            ethUsdPriceFeedAddr = networkConfig[chainId]["ethUsdPriceFeed"];
        }
    const args = [ethUsdPriceFeedAddr]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,

    })

    if(!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log('yep')
        await verify(fundMe.address, args)
    }
    
    log(network.name)
    log("==================================================== whew")

}

module.exports.tags = ["all", "fundme"]