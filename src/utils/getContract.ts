import {ethers} from "ethers";
import getProvider from './getProvider'
import {FACTORY_ADDRESSES} from "../constants/chains"
import factoryABI from '../abi/factory.json'

export const getContract = (abi: any, address: string, chainId: number) => {
    const provider = getProvider(chainId)
    return new ethers.Contract(address, abi, provider)
}

export const getFactoryContract = (chainId: number) => {
    // @ts-ignore
    return getContract(factoryABI, FACTORY_ADDRESSES[chainId], chainId)
}