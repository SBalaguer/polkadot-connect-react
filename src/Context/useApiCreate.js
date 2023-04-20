import { useEffect, useState } from "react"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { ScProvider } from "@polkadot/rpc-provider/substrate-connect"
import * as Sc from "@substrate/connect"
import { useIsMountedRef } from "./useIsMountedRef"
import NETWORKS from '../Utils/networks';

export const useApiCreate = (network) => {
  const [api, setApi] = useState()
  const [isConnected, setIsConnected] = useState(false)

  const mountedRef = useIsMountedRef()

  useEffect(() => {
    const chooseNetwork = async (network, lightClient) => {
      try {
        let newProvider;
        if (lightClient === 'true') {
          newProvider = new ScProvider(Sc, Sc.WellKnownChain[NETWORKS[network].sc]);
          await newProvider.connect();
        } else if (!lightClient || lightClient === 'false') {
          newProvider = new WsProvider(NETWORKS[network].RPC);
        }
        const _api = await ApiPromise.create({ provider: newProvider })
        setIsConnected(_api.isConnected);
        mountedRef.current && setApi(_api)
      } catch (err) {
        console.error("Error:", err)
      }
    }

    if (!isConnected && network && network.name) {
      void chooseNetwork(network.name, network.lightClient)
    }
  }, [api, isConnected, mountedRef, network])

  return api
}
