const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {
        const Verification = await hre.ethers.getContractFactory("Verification")
        const verification = await Verification.deploy()

        await verification.deployed()

        console.log(`deployed to ${verification.address}`)
        return { verification }
    }

    describe("Usage: ", function () {
        it("Manufacturers can create a record of a product", async function () {
            const { verification } = await deployContract()
            const productID = new ethers.BigNumber.from("42")
            const url = "https://google.com/123"
            const CID = ethers.utils.formatBytes32String(url)

            // console.log(productID)
            // console.log(CID)

            const tx = await verification.declareProduct(productID, CID)
            await tx.wait()

            const filter = verification.filters.ProductCreated()
            const events = await verification.queryFilter(filter)
            // console.log(events)
            console.log(
                ethers.utils.parseBytes32String(
                    events[0].args.productDetailsCID
                )
            )

            expect(
                ethers.utils.parseBytes32String(
                    events[0].args.productDetailsCID
                )
            ).to.equal(url)
        })
    })
})
