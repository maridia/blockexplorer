import convertTimestamp from '../utils/convertTimestamp.js';
import alchemy from '../alchemy.js';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
const { Utils } = require('alchemy-sdk');


function TransactionDetails() {
    const { transactionHash } = useParams();
    const [txnReceipt, setTxnReceipt] = useState();
    const [txnData, setTxnData] = useState();
    const [timestamp, setBlockTimestamp] = useState('awaiting slow api call');
    const [gasPrice, setGasPrice] = useState();
    const [gasUsed, setGasUsed] = useState();
    const [txnFee, setTxnFee] = useState();



    useEffect(() => {
        async function transactionReceipt() {
            const receipt = await alchemy.core.getTransactionReceipt(transactionHash);
            setTxnReceipt(receipt);
            Promise.resolve(receipt).then((resolvedReceipt) => {
                const used = resolvedReceipt.gasUsed;
                setGasUsed(used);
            })
            
            const data = await alchemy.core.getTransaction(transactionHash);
            setTxnData(data);
            Promise.resolve(data).then((resolvedData) => {
                const price = resolvedData.gasPrice;
                setGasPrice(price);
            })
        }
            transactionReceipt();
    }, [transactionHash]);

    useEffect(() => {
        async function getTimestamp() {
            const blockNum = txnReceipt.blockNumber;
            const block = await alchemy.core.getBlock(blockNum);

            Promise.resolve(block).then((resolvedBlock) => {
                const timestamp = resolvedBlock.timestamp;
                setBlockTimestamp(timestamp);
            })
            
        };

        if(txnReceipt) {
            getTimestamp();
        } 
    }, [txnReceipt]);

    useEffect(() => {
        Promise.all([
          Promise.resolve(gasPrice),
          Promise.resolve(gasUsed),
        ]).then(([resolvedGasPrice, resolvedGasUsed]) => {
          const fee = resolvedGasUsed * resolvedGasPrice;
          if (!isNaN(fee)) {
            const weiToString = fee.toString();
            const toEth = Utils.formatEther(weiToString);
            setTxnFee(toEth);
          } else {
            console.log('fee is NaN');
          }
        });
      }, [gasPrice, gasUsed]);

  return (
    <div>
       <div className="flex justify-center text-3xl font-bold">Transaction Receipt: </div>
       <div className='flex pt-5'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {txnData ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Transaction Hash: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {txnData.hash}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Block: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {txnData.blockNumber}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Confirmations: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {txnData.confirmations}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        TimeStamp: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {txnReceipt && timestamp !== 'awaiting slow api call' ? convertTimestamp(timestamp) : 'timestamp'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </div>
        <div className='flex py-5'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {txnData ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        To: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex text-sky-600 cursor-pointer'>
                                    <Link to={`/address/${txnData.to}`}>{txnData.to}</Link>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        From: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                            <div className='flex text-sky-600 cursor-pointer'>
                                    <Link to={`/address/${txnData.from}`}>{txnData.from}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </div>
        <div className='flex'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {txnData ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Value: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                {Utils.formatEther(txnData.value)} Eth
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Transaction Fee: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {txnFee} Eth
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Gas Price: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {Utils.formatUnits(txnData.gasPrice, "gwei")} Gwei
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </div>
    </div>
  )
}

export default TransactionDetails