// TODO: Should I first initialize Substrate-connect and then create context?
// Could be simplified to one context with the value and the update function

import React, { createContext, useState, useEffect, useContext } from 'react';

import { ScProvider } from "@polkadot/rpc-provider/substrate-connect";
import * as Sc from "@substrate/connect";
import { ApiPromise, WsProvider } from "@polkadot/api";

import NETWORKS from '../Utils/networks';

const ApiContext = createContext();

export const useApi = () => {
  return useContext(ApiContext)
}

export function SubstrateConnectWrapper ({ children }) {

    //This is the state that I want to be present on all pages
    const [isNetworkConnected, setNetworkConnected] = useState(false);
    const [connectionType, setConnectionType] = useState('RPC');
    
    const [provider, setProvider] = useState(null);
    const [network, setNetwork] = useState({
      name: 'p',
      lc: false,
    });
    const [api, setApi] = useState();

    const connect = async (chainID, lc) => {
      let newProvider;
      switch (lc) {
        case true:
          newProvider = new ScProvider(Sc, Sc.WellKnownChain[NETWORKS[chainID].sc]);
          await newProvider.connect();
          break;
        default:
          newProvider = new WsProvider(NETWORKS[chainID].RPC);
      }
  
      setProvider(newProvider);
      setNetwork({
        name: chainID,
        lc
      });
    };

    useEffect(() => {
      if (provider) {
        console.log('provider is ok')
        connectedCallback(provider);
      }
    }, [provider])


    useEffect( () => {
      console.log('only once')
    }, [])

    const connectedCallback = async (newProvider) => {
      // initiate new api and set connected.
      const newApi = await ApiPromise.create({ provider: newProvider });
      setApi(newApi);
    };

    console.log("inside Provider", api)

    return (
        <ApiContext.Provider value={{api, connect}}>
            { children }
        </ApiContext.Provider>
    );
};