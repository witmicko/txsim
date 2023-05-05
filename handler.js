
const Web3 = require('web3');
const ganache = require("ganache");



async function handler(event, context) {
  const { from, to, value, gas, gasPrice, data } = event.transaction;
  const options = event.options;
  const chainId = 1;
  const networkId = 1;

  const providerOptions = {
    //logging: {logger:{log: () => {}}},
    fork: {
      network: 'mainnet',
      blockNumber: 17195456,
    },
    chain: {
      chainId,
      networkId,
    },
    wallet: {
      totalAccounts: 0,
      unlockedAccounts: [from]
    },
    miner: {
      timestampIncrement: 8 // seconds
    }
  }

  try {
    const provider = ganache.provider(providerOptions);
    const web3 = new Web3(provider);
    // Estimate gas if not provided.
    const valueEth = Web3.utils.toWei(value, 'ether')
    
    
    
    const transaction = {
      from,
      to,
      value: Web3.utils.toHex(valueEth),
      gas: 200000,
      // gasPrice: 20,
      data
    }
    const hash = await provider.request({method: "eth_sendTransaction", params: [transaction]});
    const receipt =  await provider.request({method: "eth_getTransactionReceipt", params: [hash]});
    console.log(`>>>>>`, receipt); 


    return {
      statusCode: 200,
      body: JSON.stringify({ receipt }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

exports.handler = handler;


// https://etherscan.io/tx/0xd0a2ab0c2f3e5082c9ebdccf9dbdb6758fc276f31fbc9e08d0155b0e2e26a3a1
handler({
  "transaction": {
    "from": "0x76da732e633677b8cdebbb5fec16e32bfb00a4c1",
    "to": "0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b",
    "value": "0.471876373469235519",
    "gas": "21000",
    "gasPrice": "20",
    "data": "0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000006455351300000000000000000000000000000000000000000000000000000000000000020b080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000058d15e17628000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000058d15e17628000000000000000000000000000000000000000000000821c4adc10b2d3dca24efe800000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000aada04204e9e1099daf67cf3d5d137e84e41cf41",
  },
  "options": {
    "blockNumber": "17195456",

  }

}).then((res) => {
  console.log(res);
}).catch(console.error);