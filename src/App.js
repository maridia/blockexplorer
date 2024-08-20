import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import alchemy from "./alchemy.js";
import Navbar from "./components/Navbar.jsx";
import RecentBlocks from "./components/RecentBlocks.jsx";
import SearchBar from "./components/SearchBar.jsx";

import "./App.css";
import BlockDetails from "./components/BlockDetails.jsx";
import LatestTransactions from "./components/LatestTransactions.jsx";
import TransactionDetails from "./components/TransactionDetails.jsx";
import BlockTransactions from "./components/BlockTransactions.jsx";
import AddressTxnHistory from "./components/AddressTxnHistory.jsx";
import Retry from "./components/Retry.jsx";

function App() {
  const [blocks, setBlocks] = useState([]);
  const [latestBlock, setLatestBlock] = useState();

  useEffect(() => {
    async function getBlocks() {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setLatestBlock(latestBlockNumber);
      const blockPromises = [];

      for (let i = 0; i < 5; i++) {
        blockPromises.push(latestBlockNumber - i);
      }

      const blocks = await Promise.all(blockPromises);
      const blockTimestamps = await Promise.all(
        blockPromises.map(async (blockNumber) => {
          const block = await alchemy.core.getBlock(blockNumber);
          return block.timestamp;
        })
      );

      const blocksData = blockTimestamps.map((timestamp, index) => ({
        blockNumber: blocks[index],
        timestamp,
      }));

      setBlocks(blocksData);
    }

    getBlocks();
  }, []);

  return (
    <Router>
      <div>
        <div className="flex flex-row">
          <Navbar />
        </div>
        <Switch>
          <Route exact path="/">
            <div className="pt-14 flex justify-center">
              <SearchBar latestBlock={latestBlock} />
            </div>
            <div className="flex flex-row w-full px-10 py-14">
              <div className="basis-1/2 pr-2">
                <RecentBlocks blocks={blocks} />
              </div>
              <div className="basis-1/2 pl-2">
                <LatestTransactions blocks={blocks} />
              </div>
            </div>
          </Route>
          <Route path="/block/:blockNumber">
            <div>
              <BlockDetails />
            </div>
          </Route>
          <Route path="/address/:address">
            <div>
              <AddressTxnHistory />
            </div>
          </Route>
          <Route path="/transaction-details/:blockNumber">
            <div>
              <BlockTransactions />
            </div>
          </Route>
          <Route path="/transaction/:transactionHash">
            <TransactionDetails />
          </Route>
          <Route path="/404">
            <Retry />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
