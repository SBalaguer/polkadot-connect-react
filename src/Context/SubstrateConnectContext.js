// TODO: Should I first initialize Substrate-connect and then create context?
// Could be simplified to one context with the value and the update function

import React, { createContext, useState, useEffect, useCallback } from 'react';

import { ScProvider } from "@polkadot/rpc-provider/substrate-connect";
import * as Sc from "@substrate/connect";
import { ApiPromise, WsProvider } from "@polkadot/api";

import NETWORKS from '../Utils/networks';

const ApiContext = createContext();

export default ApiContext;

export function SubstrateConnectWrapper ({ children }) {

    //This is the state that I want to be present on all pages
    const [api, setConnectedApi] = useState();
    const [isNetworkConnected, setNetworkConnected] = useState(false);
    const [network, setNetwork] = useState('p')
    const [connectionType, setConnectionType] = useState('RPC');

    const [prov, setProv] = useState(null);

    const selectNetwork = useCallback(async (chainID, type) => {
      if (type === 'lc') {
          await selectNetworkLC(chainID);
      } else {
          await selectNetworkRPC(chainID)
      }
      setConnectionType(type)
      setNetwork(chainID)
  }, [])
    

    const selectNetworkLC = async (chainID) => {
        const provider = new ScProvider(Sc, Sc.WellKnownChain[NETWORKS[chainID].sc]);
        await provider.connect()
        const _api = await ApiPromise.create({ provider });
        setConnectedApi(_api)
        setProv(provider)
    }

    //TODO: Make it so that user could also determine it's own RPC endpoint
    const selectNetworkRPC = async (chainID) => {
        const provider = new WsProvider(NETWORKS[chainID].RPC);
        setProv(provider)
        const _api = await ApiPromise.create({ provider });
        setConnectedApi(_api)
    }

    return (
        <ApiContext.Provider value={{api, selectNetwork, prov}}>
            { children }
        </ApiContext.Provider>
    );
};