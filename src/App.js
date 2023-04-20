import { useContext, useEffect, useState, useCallback } from 'react';

import './App.css';

import ApiContext from './Context/SubstrateConnectContext'

import useApiSubscription from './unsubscribe-hook';


const App = () => {
  const [head, setNewHead] = useState(null)

  const {api, selectNetwork, isNetworkConnected} = useContext(ApiContext);

  const handleClick = (chain, type) => {
    selectNetwork(chain, type)
  }


  const getNewHeads = useCallback(() => {
    if(api){
      return api.rpc.chain.subscribeNewHeads((lastHeader) => {
        const newHeight =  lastHeader.toHuman().number
        setNewHead(newHeight);
      })
    }
  }, [api]);

  useApiSubscription(getNewHeads, isNetworkConnected);

  return (
    
    <div className="App">
      <h1>HEAD: {head}</h1>

      <h2>RPC</h2>
      
      <button onClick={() => handleClick('k', 'rpc')}>Kusama</button>
      <button onClick={() => handleClick('p', 'rpc')}>polkadot</button>
      <button onClick={() => handleClick('w', 'rpc')}>westend</button>
      <button onClick={() => handleClick('r', 'rpc')}>rococo</button>

      <h2>Light Client</h2>

      <button onClick={() => handleClick('k', 'lc')}>Kusama</button>
      <button onClick={() => handleClick('p', 'lc')}>polkadot</button>
      <button onClick={() => handleClick('w', 'lc')}>westend</button>
      <button onClick={() => handleClick('r', 'lc')}>rococo</button>
    </div>
  );
}

export default App;
