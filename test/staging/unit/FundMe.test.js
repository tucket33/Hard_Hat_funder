 
const {deployments, ethers, getNamedAccounts} = require("hardhat")
const { assert, expect } = require("chai");
 describe("FundMe", async function(){
    let fundMe    
    let deployer
    let sendValue = ethers.utils.parseEther('1')
    let mockV3Aggregator
    beforeEach(async function() {
      
        // deploy fundme\
        // const accounts = await ethers.getSigners()

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)

    })
    describe("constructor", async function(){
            it("sets the aggregator addresses correctly", async function () {
                const response = await fundMe.priceFeed()
                assert.equal(response, mockV3Aggregator.address)

            })
    })
    describe("fund", async function(){
        it("Fails if you dont send enough Eth", async function(){
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
        })

        it("updated the amount funded data structure", async function(){
            await fundMe.fund({value: sendValue})
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function(){
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.funders(0)
            assert.equal(funder,deployer)
        })
    })
    describe("withdraw", function () {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraws ETH from a single funder", async () => {
            // Arrange
            const startingFundMeBalance =
                await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance =
                await fundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance =
                await fundMe.provider.getBalance(deployer)

            // Assert
            // Maybe clean up to understand the testing
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
    })

 })