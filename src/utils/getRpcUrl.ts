import {NETWORK_RPC} from "../constants/chains"

const getNodeUrl = (chainId: number) => {
    return NETWORK_RPC[chainId]
}

export default getNodeUrl