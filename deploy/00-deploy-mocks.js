const { network } = require("hardhat");
const { devChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");



module.exports = async ({getNamedAccounts, deployments}) => { // hre = hardhat runtime env (its an object)
    const {deploy, log} = deployments; // unpacking functions
    const {deployer} = await getNamedAccounts() // unpacking accounts: the default is set in config
    // const chainId = network.config.chainId;

    if(devChains.includes(network.name)){
        log("local net detected, deploying mocks");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            
        });
        log("mocks deployed");
        log("====================================");
    }

}

module.exports.tags = ["all", "mocks"]