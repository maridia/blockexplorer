import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import alchemy from '../alchemy';

function Navbar() {
    const [gasPrice, setGasPrice] = useState('');
    const [ethPrice, setEthPrice] = useState('');

    useEffect(() => {
        async function getPrices() {
            let gasPrice = await alchemy.core.getGasPrice();
            let bigNum = gasPrice.toString();
            let gwei = bigNum / 1000000000;
            setGasPrice(Math.floor(gwei));

            let coingeckoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            let coingeckoData = await coingeckoResponse.json();
            let ethPrice = coingeckoData.ethereum.usd;
            setEthPrice(ethPrice);
        }
        getPrices();
    }, []);
    

  return (
    <div className='bg-gray-800 text-white pl-4 basis-full'>
        <div className='flex'>
            <div className='basis-40 px-5'>Gwei: {gasPrice}</div>
            <div className='basis-full px-5'>Eth Price: ${ethPrice}</div>
            <Link to='/' className='pr-10 px-5 cursor-pointer'>Home</Link>
        </div>
    </div>
  )
}

export default Navbar;