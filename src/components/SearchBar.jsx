import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

function SearchBar(props) {
    const { latestBlock } = props;
    const [searchTerm, setSearchTerm] = useState('');
    const history = useHistory();

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            if(e.target.value.startsWith('0x') && e.target.value.length === 66) {
                history.push(`/transaction/${searchTerm}`);
            } else if(e.target.value.startsWith('0x') && e.target.value.length === 42) {
                history.push(`/address/${searchTerm}`);
            } else if (e.target.value > 0 && e.target.value <= latestBlock ) {
                history.push(`/block/${searchTerm}`);
            } else {
                history.push(`/404`);
            }
        }
    };

    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

  return (
        <div className='basis-3/5'>
            <input 
                className='search-box border-2 border-gray-300 rounded w-full'
                type='search' 
                placeholder=' Search by Block / Txn Hash / Address' 
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        </div>
  )
}

export default SearchBar