import shortConvertTimestamp from '../utils/shortConvertTimestamp.js';
import React, { useState, useEffect } from 'react';
import alchemy from '../alchemy';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function LatestTransactions(props) {
    const { blocks } = props;
    const [blockTxns, setBlockTxns] = useState();
    const [firstFive, setFirstFive] = useState([]);

    useEffect(() => {
        async function blockTransactions() {
            const blockNum = parseInt(blocks[0].blockNumber);
            const btxns = await alchemy.core.getBlockWithTransactions(blockNum);
            setBlockTxns(btxns)
        }
        if(blocks[0]) {
            blockTransactions();
        } 
      }, [blocks[0]]);

      useEffect(() => {
        if(blockTxns) {
            const txnArr = blockTxns.transactions;
            setFirstFive(txnArr.slice(0, 5));
          }
      }, [blockTxns]);
    

  return (
    <div className='bg-gray-300 font-bold rounded-md'>
        <div className='flex justify-beginning border-b-2 border-gray-700 pt-2 pl-3 text-xl'>Latest Transactions</div>
            {firstFive.map((txn, index) => (
                <div className={`cursor-pointer pl-5 text-sky-600 py-2 text-base ${index !== firstFive.length - 1 ? 'border-b mx-5' : 'mx-5'}`} key={txn.hash}>
                    <div>
                        <Link to={`/transaction/${txn.hash}`}>{txn.hash.slice(0,16)}...</Link>
                    </div>
                    <div className='text-gray-500 font-light pl-10 text-sm'>{shortConvertTimestamp(blocks[0].timestamp)}</div>
                </div>
            ))}
    </div>
  )
}

export default LatestTransactions