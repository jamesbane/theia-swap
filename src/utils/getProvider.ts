import getNodeUrl from "./getRpcUrl";
import {ethers} from "ethers";

const activeWeb3Instance: any = {}
const getProvider = (chainId: number) => {
    if (!activeWeb3Instance[chainId]) {
        const RPC_URL = getNodeUrl(chainId)
        activeWeb3Instance[chainId] = new ethers.providers.JsonRpcProvider(RPC_URL, chainId)
    }

    return activeWeb3Instance[chainId]
}

export function getProviderOrSigner(library: any, account: any) {
    return account ? library.getSigner(account) : library
}

export default getProvider