import shortConvertTimestamp from '../utils/shortConvertTimestamp.js';
import React from 'react';
import { Link } from "react-router-dom";

function RecentBlocks(props) {
    const { blocks } = props;

  return (
    <div className='bg-gray-300 font-bold rounded-md'>
        <div className='flex justify-beginning border-b-2 border-gray-700 pt-2 pl-3 text-xl'>Latest Blocks</div>
        {blocks.map((block, index) => (
            <div className={`cursor-pointer pl-5 text-sky-600 py-2 text-base ${index !== blocks.length - 1 ? 'border-b mx-5' : 'mx-5'}`} key={block.blockNumber}>
                <div>
                    <Link to={`/block/${block.blockNumber}`}>{block.blockNumber}</Link>
                </div>
                <div className='text-gray-500 font-light pl-10 text-sm'>{shortConvertTimestamp(block.timestamp)}</div>
            </div>
        ))}
    </div>
  )
}

export default RecentBlocks;