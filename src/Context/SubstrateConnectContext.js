// TODO: Should I first initialize Substrate-connect and then create context?
// Could be simplified to one context with the value and the update function

import React, { createContext, useState, useEffect, useCallback } from 'react';

import { ScProvider } from "@polkadot/rpc-provider/substrate-connect";
import * as Sc from "@substrate/connect";
import { ApiPromise, WsProvider } from "@polkadot/api";

import NETWORKS from '../Utils/networks';

// const [state, dispatch] = useReducer(rootReducer, {});
// const store = React.useMemo(() => ({ state, dispatch }), [state])


const ApiContext = createContext();

export default ApiContext;

export function SubstrateConnectWrapper ({ children }) {

    //This is the state that I want to be present on all pages
    const [api, setConnectedApi] = useState();
    const [isNetworkConnected, setNetworkConnected] = useState(false);
    const [network, setNetwork] = useState("p")
    const [connectionType, setConnectionType] = useState('RPC');
    const [provider, setProvider] = useState();
    // const [connectionStatus, setConnectionStatus] = useState();


    // by default this connects to Polkadot
    // useEffect(() =>{
    //     //check UsePrevious
    //     const startApi = async () => {
    //         await selectNetwork(network, connectionType);
    //     }

    //     if(!isNetworkConnected){
    //         // startApi();
    //     }

    // },[isNetworkConnected])

    //CHOOSE LIGHT CLIENT OR RPC CONNECTION
    const selectNetwork = useCallback(async (chainID, type) => {
        if (type === 'lc') {
            await selectNetworkLC(chainID);
        } else {
            await selectNetworkRPC(chainID)
        }
        setConnectionType(type)
        setNetwork(chainID)
    },[]);


    //CONNECTS TO LIGHT CLIENT
    const selectNetworkLC = async (chainID) => {

        if(isNetworkConnected){
            await provider.disconnect();
            setNetworkConnected(false);
            setConnectedApi()
        }

        const newProvider = new ScProvider(Sc, Sc.WellKnownChain[NETWORKS[chainID].sc]);
        await newProvider.connect()
        const _api = await ApiPromise.create({ provider: newProvider });
        setConnectedApi(_api)
        setNetworkConnected(_api._isReady);
    };

    //CONNECTS TO RPC
    //TODO: Make it so that user could also determine it's own RPC endpoint
    const selectNetworkRPC = async (chainID) => {
        console.log("top",isNetworkConnected)
        if(isNetworkConnected){
            console.log('running here')
            await provider.disconnect();
            setNetworkConnected(false);
            setConnectedApi()
        }
        
        const newProvider = new WsProvider(NETWORKS[chainID].RPC);
        setProvider(newProvider)
        const _api = await ApiPromise.create({ provider: newProvider });
        console.log("API VALUE", _api._isReady);
        setNetworkConnected(_api._isReady);
        console.log('bottom', isNetworkConnected)
        setConnectedApi(_api)
    };

    return (
        <ApiContext.Provider value={{api, selectNetwork, isNetworkConnected, provider}}>
            { children }
        </ApiContext.Provider>
    );
};