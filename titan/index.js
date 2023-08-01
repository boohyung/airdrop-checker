const { ethers } = require('ethers');

const dataArray = [1, 'apple', 'banana', 42, 'orange', 'grape'];

async function getAddressesWithMoreThanNTransactions(blockRange, threshold) {
  const rpcUrl = 'https://rpc.titan.tokamak.network'; // Replace this with your Ethereum node's RPC endpoint
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  const addressesCounter = {};

  // Loop through blocks in the given range
  for (let blockNumber = 1; blockNumber <= blockRange; blockNumber++) {
    const block = await provider.getBlock(blockNumber, true); // Retrieve block data with transactions
    console.log(`processing... until block ${blockNumber}`)

    // Loop through transactions in the block
    for (const tx of block.transactions) {
        const txHash = extractStringFromArray(block.transactions);
        const transaction = await provider.getTransaction(txHash)
      const senderAddress = transaction.from
      if (addressesCounter[senderAddress]) {
        addressesCounter[senderAddress]++;
      } else {
        addressesCounter[senderAddress] = 1;
      }
    }
  }
  console.log('Address Counter list');
  console.log(addressesCounter)

  // Filter addresses that have requested transactions more than the threshold
  const addressesWithMoreThanThreshold = Object.keys(addressesCounter).filter(
    (address) => addressesCounter[address] > threshold
  );

  return addressesWithMoreThanThreshold;
}

const blockRange = 741;
const threshold = 5;

getAddressesWithMoreThanNTransactions(blockRange, threshold)
  .then((addresses) => {
    console.log(`Addresses with more than ${threshold} transactions in blocks 1 to ${blockRange}:`);
    console.log(addresses);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function extractStringFromArray(arr) {
    if (Array.isArray(arr) && arr.length === 1 && typeof arr[0] === 'string') {
    return arr[0];
    } else {
        throw new Error('Invalid input. The array should contain exactly one string element.');
    }
}