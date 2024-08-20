import shortConvertTimestamp from '../utils/shortConvertTimestamp.js';
import alchemy from '../alchemy.js';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Utils } from 'alchemy-sdk';

function BlockTransactions() {
    const { blockNumber } = useParams();
    const [block, setBlock] = useState();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function blockTransactions() {
          const _block = await alchemy.core.getBlockWithTransactions(parseInt(blockNumber));
          setBlock(_block);
          Promise.resolve(_block).then((resolvedBlock) => {
            const txns = resolvedBlock.transactions;
            if (!txns) {
                return;
            } else {
                setTransactions(txns);
            }  
          })
        }

        if (blockNumber) {
          blockTransactions();
        }
      }, [blockNumber]);


  return (
    <div>
        {block ? (
        <div>
            {transactions.length === 0 ? (
                <div className='flex justify-center pt-4 font-bold text-xl'>There are no transactions</div>
            ) : (
                <div>
                    <div className="flex justify-center text-3xl font-bold">Transaction details for block {blockNumber}</div>
                    <div className='flex justify-center'>
                        <div className='grid grid-cols-12 font-bold w-11/12 mt-4 pl-4'>
                            <div className='col-start-1 col-end-3'>Transaction hash</div>
                            <div className='col-start-3 col-span-2'>Age</div>
                            <div className='col-start-5 col-span-2'>Block Number</div>
                            <div className='col-start-7 col-end-9'>From</div>
                            <div className='col-start-9 col-end-11'>To</div>
                            <div className='col-start-11 col-span-2'>Value</div> 
                        </div>
                    </div>
                    <div>
                        {transactions.map((element, index) =>
                        <div className='flex justify-center' key={element.hash}>
                            {index === 0 ? (
                                <div className='grid grid-cols-12 bg-gray-200 w-11/12 rounded-t-md mt-2 pl-4 divide-slate-300'>
                                    <div></div>
                                    <div className='col-start-1 col-span-2 text-sky-600 cursor-pointer'>
                                        <Link to={`/transaction/${element.hash}`}>{element.hash.slice(0, 16)}...</Link>
                                    </div>
                                    <div className='col-start-3 col-span-2'>{shortConvertTimestamp(block.timestamp)}</div>
                                    <div className='col-start-5 col-span-2 text-sky-600 cursor-pointer'>
                                        <Link to={`/block/${element.blockNumber}`}>{element.blockNumber}</Link>
                                    </div>
                                    <div className='col-start-7 col-end-9 text-sky-600 cursor-pointer'>
                                        <Link to={`/address/${element.from}`}>{element.from.slice(0, 8)}...{element.from.slice(-8)}</Link>
                                    </div>
                                    {element.to ? (
                                        <div className='col-start-9 col-end-11 text-sky-600 cursor-pointer'>
                                            <Link to={`/address/${element.to}`}>{element.to.slice(0, 8)}...{element.to.slice(-8)}</Link>
                                        </div>
                                    ) : (
                                        <div className='col-start-9 col-end-11'>Contract creation</div>
                                    )}
                                    {Utils.formatEther(element.value) < 0.00000001 ? (
                                        <div className='col-start-11 col-span-2'>0 Eth</div> 
                                    ) : (
                                        <div className='col-start-11 col-span-2'>{Utils.formatEther(element.value.toString()).slice(0,10)} Eth</div>
                                    )} 
                                </div>
                            ) : index === transactions.length-1 ? (
                                <div className='grid grid-cols-12 bg-gray-200 w-11/12 rounded-b-md mb-10 pl-4 divide-y divide-slate-300'>
                                    <div></div>
                                    <div className='col-start-1 col-span-2 text-sky-600 cursor-pointer'>
                                        <Link to={`/transaction/${element.hash}`}>{element.hash.slice(0, 16)}...</Link>
                                    </div>
                                    <div className='col-start-3 col-span-2'>{shortConvertTimestamp(block.timestamp)}</div> 
                                    <div className='col-start-5 col-span-2 text-sky-600 cursor-pointer'>
                                        <Link to={`/block/${element.blockNumber}`}>{element.blockNumber}</Link>
                                    </div>
                                    <div className='col-start-7 col-end-9 text-sky-600 cursor-pointer'>
                                        <Link to={`/address/${element.from}`}>{element.from.slice(0, 8)}...{element.from.slice(-8)}</Link>
                                    </div>
                                    {element.to ? (
                                        <div className='col-start-9 col-end-11 text-sky-600 cursor-pointer'>
                                            <Link to={`/address/${element.to}`}>{element.to.slice(0, 8)}...{element.to.slice(-8)}</Link>
                                        </div>
                                    ) : (
                                        <div className='col-start-9 col-end-11'>Contract creation</div>
                                    )}
                                    {Utils.formatEther(element.value) < 0.00000001 ? (
                                        <div className='col-start-11 col-span-2'>0 Eth</div> 
                                    ) : (
                                        <div className='col-start-11 col-span-2'>{Utils.formatEther(element.value.toString()).slice(0,10)} Eth</div>
                                    )} 
                                </div>
                            ) : (
                                <div className='grid grid-cols-12 bg-gray-200 w-11/12 pl-4 divide-y divide-slate-300'>
                                    <div></div>
                                    <div className='col-start-1 col-span-2 text-sky-600 cursor-pointer'>
                                        <Link to={`/transaction/${element.hash}`}>{element.hash.slice(0, 16)}...</Link>
                                    </div>
                                    <div className='col-start-3 col-span-2'>{shortConvertTimestamp(block.timestamp)}</div>
                                    <div className='col-start-5 col-span-2 text-sky-600 cursor-pointer'>
                                        <Link to={`/block/${element.blockNumber}`}>{element.blockNumber}</Link>
                                    </div>
                                    <div className='col-start-7 col-end-9 text-sky-600 cursor-pointer'>
                                        <Link to={`/address/${element.from}`}>{element.from.slice(0, 8)}...{element.from.slice(-8)}</Link>
                                    </div>
                                    {element.to ? (
                                        <div className='col-start-9 col-end-11 text-sky-600 cursor-pointer'>
                                            <Link to={`/address/${element.to}`}>{element.to.slice(0, 8)}...{element.to.slice(-8)}</Link>
                                        </div>
                                    ) : (
                                        <div className='col-start-9 col-end-11'>Contract creation</div>
                                    )}
                                    {Utils.formatEther(element.value) < 0.00000001 ? (
                                        <div className='col-start-11 col-span-2'>0 Eth</div> 
                                    ) : (
                                        <div className='col-start-11 col-span-2'>{Utils.formatEther(element.value.toString()).slice(0,10)} Eth</div>
                                    )} 
                                </div>
                            )}
                        </div>
                )}
                    </div>
                </div>
            )}
        </div>
        ) : (
            <div className='flex items-center justify-center h-screen text-2xl'>Loading...</div>
        )}
    </div>
  )
}

export default BlockTransactions