const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const ethers = require('ethers')
const app = express();
const TokenContract = require("./ERC20.json")

const RPC_URL = 'https://hack.streamr.network/mainchain-rpc/http/'
const TOKEN_ADDRESS = '0xbAA81A0179015bE47Ad439566374F2Bae098686F'
const ACCOUNT_ADDRESS = '0x4178baBE9E5148c6D5fd431cD72884B07Ad855a0'
const PRIVATE_KEY = '0xe5af7834455b7239881b85be89d905d6881dcb4751063897f12be1b0dd546bdb'
// const TEST_RECEIVER_ADDRESS = '0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1'
// const TEST_PRIVATE_KEY = '0x5e98cce00cff5dea6b454889f359a4ec06b9fa6b88e9d69b86de8e1c81887da0'

const GAS_PRICE_GWEI = '100'
const DATA_WEI_AMOUNT = '100000000000000000000'
const ETH_WEI_AMOUNT = '1000000000000000000'

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// create application/json parser
const jsonParser = bodyParser.json()

app.use(cors());

// Send tokens to address
app.get('/transfer-tokens/:address', async function (req, res) {
    const RECEIVER_ADDRESS = req.params.address
    console.log(`enter transfer-tokens: ${RECEIVER_ADDRESS}`)
    if (!RECEIVER_ADDRESS) { res.sendStatus(400) }

    const provider = ethers.getDefaultProvider(RPC_URL)
    if (!provider) { res.sendStatus(500) }

    const dataWeiAmount = ethers.BigNumber.from(DATA_WEI_AMOUNT)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

    const options = {}
    options.gasPrice = ethers.utils.parseUnits(GAS_PRICE_GWEI, "gwei")

    // Transfer DATA to user's address
    const token = new ethers.Contract(TOKEN_ADDRESS, TokenContract.abi, wallet)
    const dataTx = await token.transfer(RECEIVER_ADDRESS, dataWeiAmount, options)
    console.log(`DATA TX hash: ${dataTx.hash}`)
    const dataTr = await dataTx.wait(1)
    console.log(`DATA Receipt: ${JSON.stringify(dataTr)}`)

    // Transfer ETH to user's address
    const ethTx = await wallet.sendTransaction({
        to: RECEIVER_ADDRESS,
        value: ethers.utils.parseEther("1.0")
    });

    console.log(`ETH TX hash: ${ethTx.hash}`)
    const ethTr = await ethTx.wait(1)
    console.log(`ETH Receipt: ${JSON.stringify(ethTr)}`)

    res.sendStatus(200)
})

const server = app.listen(8090, function () {
    console.log('listening on 8090');
});
