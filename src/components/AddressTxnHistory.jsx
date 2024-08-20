import alchemy from '../alchemy';
import React, { useState, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function AddressTxnHistory() {
    const { address } = useParams();
    const [assetTransfers, setAssetTransfers] = useState(null);
    const [error, setError] = useState();

    useEffect(() => {
        async function getAssetTransfers() {
            try {
                const data = await alchemy.core.getAssetTransfers({
                    fromBlock: "0x0",
                    fromAddress: address,
                    category: ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"]
                });
                setAssetTransfers(data.transfers);
            } catch (err) {
                setError(err);
                console.error(err);
            }
        }
        getAssetTransfers();
    }, [address]);


  return (
    <div>
        {!error ? (
            <div>
                {assetTransfers ? (
                    <div>
                    {assetTransfers.length === 0 ? (
                        <div className='flex justify-center pt-4 font-bold text-xl'>There are no asset transfers for this address...</div>
                    ) : (
                        <div>
                            <div className="flex justify-center text-3xl font-bold">Address: {address}</div>
                            <div className='flex justify-center'>
                                <div className='grid grid-cols-10 font-bold w-11/12 mt-4 pl-4'>
                                    <div className='col-start-1 col-end-3'>Transaction hash</div>
                                    <div className='col-start-3 col-span-2'>Block Number</div>
                                    <div className='col-start-5 col-end-7'>From</div>
                                    <div className='col-start-7 col-end-9'>To</div>
                                    <div className='col-start-9 col-span-2'>Value</div> 
                                </div>
                            </div>
                            <div>
                                {assetTransfers.map((element, index) =>
                                <div className='flex justify-center' key={element.hash + index}>
                                    {index === 0 ? (
                                        <div className='grid grid-cols-10 bg-gray-200 w-11/12 rounded-t-md mt-2 pl-4 divide-slate-300'>
                                            <div></div>
                                            <div className='col-start-1 col-span-2 text-sky-600 cursor-pointer'>
                                                <Link to={`/transaction/${element.hash}`}>{element.hash.slice(0, 16)}...</Link>
                                            </div>
                                            <div className='col-start-3 col-span-2 text-sky-600 cursor-pointer'>
                                                <Link to={`/block/${Number(element.blockNum)}`}>{Number(element.blockNum)}</Link>
                                            </div>
                                            <div className='col-start-5 col-end-7 text-sky-600 cursor-pointer'>
                                                <Link to={`/address/${element.from}`}>{element.from.slice(0, 8)}...{element.from.slice(-8)}</Link>
                                            </div>
                                            {element.to ? (
                                                <div className='col-start-7 col-end-9 text-sky-600 cursor-pointer'>
                                                    <Link to={`/address/${element.to}`}>{element.to.slice(0, 8)}...{element.to.slice(-8)}</Link>
                                                </div>
                                            ) : (
                                                <div className='col-start-7 col-end-9'>Contract creation</div>
                                            )}
                                            {element.value < 0.00000001 ? (
                                                <div className='col-start-9 col-span-2'>0 Eth</div> 
                                            ) : (
                                                <div className='col-start-9 col-span-2'>{(element.value.toString()).slice(0,10)} {element.asset}</div>
                                            )} 
                                        </div>
                                    ) : index === assetTransfers.length-1 ? (
                                        <div className='grid grid-cols-10 bg-gray-200 w-11/12 rounded-b-md mb-10 pl-4 divide-y divide-slate-300'>
                                            <div></div>
                                            <div className='col-start-1 col-span-2 text-sky-600 cursor-pointer'>
                                                <Link to={`/transaction/${element.hash}`}>{element.hash.slice(0, 16)}...</Link>
                                            </div>
                                            <div className='col-start-3 col-span-2 text-sky-600 cursor-pointer'>
                                                <Link to={`/block/${Number(element.blockNum)}`}>{Number(element.blockNum)}</Link>
                                            </div>
                                            <div className='col-start-5 col-end-7 text-sky-600 cursor-pointer'>
                                                <Link to={`/address/${element.from}`}>{element.from.slice(0, 8)}...{element.from.slice(-8)}</Link>
                                            </div>
                                            {element.to ? (
                                                <div className='col-start-7 col-end-9 text-sky-600 cursor-pointer'>
                                                    <Link to={`/address/${element.to}`}>{element.to.slice(0, 8)}...{element.to.slice(-8)}</Link>
                                                </div>
                                            ) : (
                                                <div className='col-start-7 col-end-9'>Contract creation</div>
                                            )}
                                            {element.value < 0.00000001 ? (
                                                <div className='col-start-9 col-span-2'>0 Eth</div> 
                                            ) : (
                                                <div className='col-start-9 col-span-2'>{(element.value.toString()).slice(0,10)} {element.asset}</div>
                                            )} 
                                        </div>
                                    ) : (
                                        <div className='grid grid-cols-10 bg-gray-200 w-11/12 pl-4 divide-y divide-slate-300'>
                                            <div></div>
                                            <div className='col-start-1 col-span-2 text-sky-600 cursor-pointer'>
                                                <Link to={`/transaction/${element.hash}`}>{element.hash.slice(0, 16)}...</Link>
                                            </div>
                                            <div className='col-start-3 col-span-2 text-sky-600 cursor-pointer'>
                                                <Link to={`/block/${Number(element.blockNum)}`}>{Number(element.blockNum)}</Link>
                                            </div>
                                            <div className='col-start-5 col-end-7 text-sky-600 cursor-pointer'>
                                                <Link to={`/address/${element.from}`}>{element.from.slice(0, 8)}...{element.from.slice(-8)}</Link>
                                            </div>
                                            {element.to ? (
                                                <div className='col-start-7 col-end-9 text-sky-600 cursor-pointer'>
                                                    <Link to={`/address/${element.to}`}>{element.to.slice(0, 8)}...{element.to.slice(-8)}</Link>
                                                </div>
                                            ) : (
                                                <div className='col-start-7 col-end-9'>Contract creation</div>
                                            )}
                                            {element.value < 0.00000001 ? (
                                                <div className='col-start-9 col-span-2'>0 Eth</div> 
                                            ) : (
                                                <div className='col-start-9 col-span-2'>{(element.value.toString()).slice(0,10)} {element.asset}</div>
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
        ) : (
            <div className='flex items-center justify-center h-screen text-2xl'>I am sorry but your search cannot be found. Please check to see if you typed it in correctly and try again.</div>
        )}
    </div>
  )
}

export default AddressTxnHistory;