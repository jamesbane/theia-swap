import {useMemo} from "react"
import EXCHANGE_ABI from '../abi/exchange.json'
import {useWeb3React} from "@web3-react/core";
import {ethers} from "ethers";
import {getProviderOrSigner} from "../utils/getProvider";

export function getExchangeContract(exchangeAddress: string, library: any, account: any) {
    return new ethers.Contract(exchangeAddress, EXCHANGE_ABI as any, getProviderOrSigner(library, account))

}

export function useExchangeContract(exchangeAddress: string, withSignerIfPossible = true) {
    const { chainId, library, account } = useWeb3React()

    return useMemo(() => {
        try {
            return getExchangeContract(exchangeAddress, library, account)
        } catch {
            return null
        }
    }, [exchangeAddress, withSignerIfPossible, chainId])
}