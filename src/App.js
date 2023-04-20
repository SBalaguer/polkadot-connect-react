import {  useEffect, useState } from 'react';

import './App.css';

import { useApiCreate } from './Context/useApiCreate';
import { useLocalStorage } from './Context/useLocalStorage'

const App = () => {
  const [head, setNewHead] = useState(null)

  const [endpoint, setEndpoint] = useLocalStorage("test_endpoint");
  const [lightClient, setLightClient] = useLocalStorage("test_lightClient");
  
  if (!endpoint) setEndpoint('polkadot')
  if (!endpoint) setLightClient(false)

  const api = useApiCreate({name: endpoint, lightClient: lightClient});

  useEffect(() =>{
    const checkHeads = async () => {
      await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        const newHeight =  lastHeader.toHuman().number
        setNewHead(newHeight);
      });
    }

    if(api && api.isConnected){
      checkHeads()
    }
  },[api]);

  const clickThis = (endp, lc) => {
      setEndpoint(endp);
      setLightClient(lc);
      window.location.reload(false);
  }

  return (
    <div className="App">
      <h1>Network: {endpoint.toUpperCase()}</h1>
      <h1>Light Client: {lightClient === 'true' ? 'Yes' : 'No'}</h1>
      <h2>HEAD: {head}</h2>

      <h2>RPC</h2>
      
      <button disabled={endpoint === 'kusama' && lightClient!=='true'} onClick={() => clickThis('kusama', false)}>Kusama</button>
      <button disabled={endpoint === 'polkadot' && lightClient!=='true'} onClick={() => clickThis('polkadot', false)}>polkadot</button>
      <button disabled={endpoint === 'westend' && lightClient!=='true'} onClick={() => clickThis('westend', false)}>westend</button>
      <button disabled={endpoint === 'rococo' && lightClient!=='true'} onClick={() => clickThis('rococo', false)}>rococo</button>

      <h2>Light Client</h2>

      <button disabled={endpoint === 'kusama' && lightClient==='true'} onClick={() => clickThis('kusama', true)}>Kusama</button>
      <button disabled={endpoint === 'polkadot' && lightClient==='true'} onClick={() => clickThis('polkadot', true)}>polkadot</button>
      <button disabled={endpoint === 'westend' && lightClient==='true'} onClick={() => clickThis('westend', true)}>westend</button>
      <button disabled={endpoint === 'rococo' && lightClient==='true'} onClick={() => clickThis('rococo', true)}>rococo</button>
    </div>
  );
}

export default App;
