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
    const [api, setConnectedApi] = useState(null);
    const [isNetworkConnected, setNetworkConnected] = useState(false);
    const [network, setNetwork] = useState("p")
    const [connectionType, setConnectionType] = useState('RPC');
    const [provider, setProvider] = useState(null);

    // by default this connects to Polkadot
    useEffect(() =>{
        //check UsePrevious
        const startApi = async () => {
            await selectNetwork(network, connectionType);
        }
        if(!provider){
            startApi();
        }
    })

    //CHOOSE LIGHT CLIENT OR RPC CONNECTION
    const selectNetwork = async (chainID, type) => {
        cleanupState()
        if (type === 'lc') {
            await selectNetworkLC(chainID);
        } else {
            await selectNetworkRPC(chainID)
        }
        setConnectionType(type)
        setNetwork(chainID)
    };

    //State cleaner to be used when changing networks
    const cleanupState = () => {
        setNetworkConnected(false);
        setConnectedApi(null);
        setProvider(null)
        setNetwork(null)
        setConnectionType(null)
    }

    //CONNECTS TO LIGHT CLIENT
    const selectNetworkLC = async (chainID) => {

        if(provider){
            await provider.disconnect();
        }

        if (chainID){
            const newProvider = new ScProvider(Sc, Sc.WellKnownChain[NETWORKS[chainID].sc]);
            await newProvider.connect()
            const _api = await ApiPromise.create({ provider: newProvider });
            setConnectedApi(_api)
            setNetworkConnected(_api._isReady);
        }
    };

    //CONNECTS TO RPC
    //TODO: Make it so that user could also determine it's own RPC endpoint
    const selectNetworkRPC = async (chainID) => {
        if(provider){
            await provider.disconnect();
        }

        if(chainID){
            const newProvider = new WsProvider(NETWORKS[chainID].RPC);
            setProvider(newProvider)
            const _api = await ApiPromise.create({ provider: newProvider });
            setNetworkConnected(_api._isReady);
            setConnectedApi(_api)
        }
    };

    return (
        <ApiContext.Provider value={{api, selectNetwork, isNetworkConnected}}>
            { children }
        </ApiContext.Provider>
    );
};