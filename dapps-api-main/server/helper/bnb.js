const config = require("config");
const tokenERC = require("./token");
const Web3 = require("web3");

let web3 = new Web3(new Web3.providers.HttpProvider(config.get("rpc")));
let web3Websocket = new Web3(new Web3.providers.WebsocketProvider(config.get("rpcws")));

const masContractAddress = config.get("masContractAddress");
const busdContractAddress = config.get("busdContractAddress");
const usdtContractAddress = config.get("usdtContractAddress");

const mas = new tokenERC("MAS", masContractAddress, web3, web3Websocket);
const busd = new tokenERC("BUSD", busdContractAddress, web3, web3Websocket);
const usdt = new tokenERC("USDT", usdtContractAddress, web3, web3Websocket);

async function gasFee(gasLimit = 21000) {
  let gasPrice = await web3.eth.getGasPrice();
  let fee = gasLimit * gasPrice;
  let txFee = Number(web3.utils.fromWei(fee.toString(), "ether"));

  return { fee: txFee, gasPrice: gasPrice };
}

async function balance(address) {
  return await web3.eth.getBalance(address);
}

async function accountBalance(address) {
  const response = await balance(address);
  let _balance = web3.utils.fromWei(response, "ether");
  return Number(_balance);
}

async function canAddressSend(address, amount) {
  const { fee } = await gasFee();

  // Get address balance with wei unit
  let balance = await accountBalance(address);

  // Check if result more than
  return balance - amount - fee >= 0;
}

async function withdraw(fromAddress, fromPrivateKey, toAddress, amountToSend) {
  try {
    const gasPrice = await web3.eth.getGasPrice();

    const status = await canAddressSend(fromAddress, amountToSend);

    // Check is balance low
    if (status == false) {
      
      return {
        status: false
      }
    }

    // Create transaction object
    let transaction = {
      to: toAddress,
      value: web3.utils.toHex(
        web3.utils.toWei(amountToSend.toString(), "ether")
      ),
      gas: 21000,
      gasPrice: gasPrice,
    };

    //
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      fromPrivateKey
    );

    //
    const signTransaction = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    // Return sucess
    return {
      Status: true,
      Hash: signTransaction.transactionHash,
      message: "Success",
    };
  } catch (error) {
    return {
      Status: false,
      message: "Something went wrong!",
    };
  }
}

async function fullWithdraw(fromAddress, fromPrivateKey, toAddress) {
  const { fee } = await gasFee();
  const amountToSend = (await accountBalance(fromAddress)) - fee - 0.000001;

  const result = await withdraw(
    fromAddress,
    fromPrivateKey,
    toAddress,
    amountToSend
  );

  // Add balance to result object
  result.Balance = amountToSend;

  //
  return result;
}

async function getConfirmations(txHash) {
  try {
    const tx = await web3.eth.getTransaction(txHash)
    const currentBlock = await web3.eth.getBlockNumber()
    return tx.blockNumber === null ? 0 : currentBlock - tx.blockNumber
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = {
  balance,
  accountBalance,
  canAddressSend,
  withdraw,
  fullWithdraw,
  getConfirmations,
  gasFee,
  mas,
  usdt,
  busd,
};
