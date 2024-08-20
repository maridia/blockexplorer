import alchemy from '../alchemy.js';
import convertTimestamp from '../utils/convertTimestamp.js';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
const { Utils } = require('alchemy-sdk');


function BlockDetails() {
    const { blockNumber } = useParams();
    const [blockTxns, setBlockTxns] = useState();
    const [gasUsed, setGasUsed] = useState();
    const [gasLimit, setGasLimit] = useState();
    const [baseFeePerGas, setBaseFeePerGas] = useState();
    const [burntFees, setBurntFees] = useState();
    const [txnFees, setTxnFees] = useState();
    const [blockReward, setBlockReward] = useState();

    useEffect(() => {
        async function blockTransactions() {
            try {
                const block = await alchemy.core.getBlockWithTransactions(parseInt(blockNumber));
                setBlockTxns(block);
                Promise.resolve(block).then((resolvedBlock) => {
                    const used = resolvedBlock.gasUsed;
                    setGasUsed(used);
                    const limit = resolvedBlock.gasLimit;
                    setGasLimit(limit);
                    if(resolvedBlock.baseFeePerGas) {
                        const feePerGas = resolvedBlock.baseFeePerGas;
                        setBaseFeePerGas(feePerGas);
                    } 
                })
            } catch (error) {
                console.error(error);
            }
        }

        if (blockNumber) {
          blockTransactions();
        }
      }, [blockNumber]);

      useEffect(() => {
        async function blockReward() {
            try {
                const hash = blockTxns.hash;
                const hashObj = {
                    blockHash: hash
                };
                const txnReceipts = await alchemy.core.getTransactionReceipts(hashObj);
                const receipts = txnReceipts.receipts;
                let cumulativeTxnFees = 0;

                for (let i = 0; i < receipts.length; i++) {
                    const receipt = receipts[i];
                    const effectiveGasPrice = parseInt(receipt.effectiveGasPrice);
                    const _gasUsed = parseInt(receipt.gasUsed);
                    const txnFee = effectiveGasPrice * _gasUsed;
                    cumulativeTxnFees += txnFee;
                }
                const txnFeeString = cumulativeTxnFees.toString();
                const convertedTxnFees = Utils.formatEther(txnFeeString);
                setTxnFees(convertedTxnFees);
            } catch (error) {
                console.error(error);
            }
        }
        if(blockTxns) {
            blockReward();
        }  
      }, [blockTxns]);

      useEffect(() => {
        try {
            const _burntFees = gasUsed * baseFeePerGas;
            Promise.resolve(_burntFees).then((resolvedBurns => {
                const burned = resolvedBurns;
                if(!isNaN(burned)) {
                    const burnedString = burned.toString();
                    const convertedBurn = Utils.formatEther(burnedString)
                    setBurntFees(convertedBurn);
                } else {
                    setBurntFees(0)
                    console.log('burned fee is NaN')
                }
            }))
        } catch (error) {
            console.error(error);
        }
         
      }, [gasUsed, baseFeePerGas]);

      useEffect(() => {
        if(burntFees && txnFees) {
            const burntInt = Number(burntFees);
            const txnInt = Number(txnFees);
            const _blockReward = txnInt - burntInt;
            setBlockReward(_blockReward);
        }
      }, [burntFees, txnFees])


  return (
    <div>
      <div className="flex justify-center text-3xl font-bold">Block Number: {blockNumber}</div>
      <div className='flex pt-5'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {blockTxns ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Block Height: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {blockNumber}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Transactions: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex flex-row'>
                                    <div className='pr-1 text-sky-600 cursor-pointer'>
                                        <Link to={`/transaction-details/${blockNumber}`}>{blockTxns.transactions.length} transactions</Link>
                                    </div>
                                    <div>
                                        on this block
                                    </div>   
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
                                    {convertTimestamp(blockTxns.timestamp)}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </div>
        <div className='flex pt-5'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {blockTxns ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Fee Recipient: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {blockTxns.miner}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Block Reward: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {!blockReward ? (
                                        <div>0</div>
                                    ) : (
                                        <div>{blockReward} (0 static block reward + {txnFees} transaction fees - {burntFees} burnt fees)</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </div>
        <div className='flex pt-5'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {blockTxns ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Gas Used: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                {Utils.formatUnits(gasUsed, "wei")} Wei
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Gas Limit: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                {Utils.formatUnits(gasLimit, "wei")} Wei
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Base Fee Per Gas: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>                 
                                    {baseFeePerGas ? (
                                        <div className='flex'>{Utils.formatUnits(baseFeePerGas, "gwei")} Gwei</div>
                                    ) : (
                                        <div className='flex'>No base fee per gas</div>
                                    )}
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Burnt Fees: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                {burntFees === 0 ? (
                                    <div>0 Eth</div>
                                ) : (
                                    <div className='flex'>{burntFees} Eth</div>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Extra Data: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {blockTxns.extraData}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'Loading'
                )}
            </div>
        </div>
        <div className='flex pt-5'>
            <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
                {blockTxns ? (
                    <div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Hash: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {blockTxns.hash}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Parent Hash: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {blockTxns.parentHash}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                            <div className='w-1/3'>
                                <div className='flex'>
                                    <div className='font-bold'>
                                        Nonce: 
                                    </div>
                                </div>
                            </div>
                            <div className='w-2/3'>
                                <div className='flex'>
                                    {blockTxns.nonce}
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
  );
}

export default BlockDetails