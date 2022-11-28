const config = require("config");
let contractABI = config.get("contractABI");
contractABI = contractABI.map((method) => ({ ...method }));

module.exports = class tokenERC {
  constructor(coin, address, web3, web3Websocket) {
    this.web3 = web3;
    this.web3Websocket = web3Websocket;
    this.contract = new web3.eth.Contract(contractABI, address);
    this.address = address;
    this.coin = coin;
  }

  async weibBalance(address) {
    return await this.contract.methods.balanceOf(address).call();
  }

  async balance(address) {
    const weibBalance = await this.weibBalance(address);
    return this.web3.utils.fromWei(weibBalance);
  }

  async canAddressSend(address, amount) {
  
    let balance = await this.weibBalance(address);
  
    return Number(balance)  >= Number(amount);
  }

  async withdraw(address, privateKey, toAddress, amount, gas="54429") {
    try {

      const status = await this.canAddressSend(address, amount);

      if (status == false) {
        console.log({ 
          status: status, 
          message: this.coin + " Low Balance" ,
          balance: Number(await this.balance(address)),
          amountToSend: Number(this.web3.utils.fromWei(amount, "ether"))
        });
        return { Success: false };
      }


      let gasPrice = await this.web3.eth.getGasPrice();

      const Data = await this.contract.methods
        .transfer(toAddress, amount.toString())
        .encodeABI();

      const rawTransaction = {
        to: this.address,
        from: address,
        value: 0,
        gasPrice: gasPrice,
        gasLimit: this.web3.utils.toHex(gas),
        data: Data,
      };

      const signPromise = await this.web3.eth.accounts.signTransaction(
        rawTransaction,
        privateKey.toString()
      );

      let result = await this.web3.eth.sendSignedTransaction(
        signPromise.rawTransaction
      );

      console.log('sendSignedTransaction: ',result)

      return {
        Success: true,
        Hash: result.transactionHash,
      };
      
    } catch (error) {
      console.log(error);
      return { Success: false };
    }
  }

  async fullWithdraw(address, privateKey, toAddress) {
    const amount = await this.weibBalance(address);
    return await this.withdraw(address, privateKey, toAddress, amount);
  }


  async trackDeposits(addrPool, callBack) {

    // Instantiate token contract object with JSON ABI and address
    const tokenContract = new this.web3Websocket.eth.Contract(
      contractABI, this.address,
      (error, result) => { 
        if (error) console.log(error);
        console.log(result); 
      });

      const currentBlockNumber = await this.web3.eth.getBlockNumber();
      const fromBlock = Number(currentBlockNumber) - 2000;

      console.log('start tracking from block number', fromBlock);
  
    // Generate filter options
    const options = {
      filter: {
        to: addrPool,
      },
      fromBlock: fromBlock
    }
  
    // Subscribe to Transfer events matching filter criteria
    tokenContract.events.Transfer(options, async (error, event) => {
      if (error) {
        console.error('Deposit tracking error:', error.message);
        return
      }

      let value = this.web3.utils.fromWei(event.returnValues.value, "ether");
      let hash  = event.transactionHash;
      let from  = event.returnValues.from.toLowerCase();
      let to    =   event.returnValues.to.toLowerCase();
      if(addrPool.includes(to)){
        callBack(
          hash,
          this.coin,
          value,
          from,
          to
        );  
      }
    });
  }
}
