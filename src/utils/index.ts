import {getFactoryContract} from "./getContract";

export async function getTokenExchangeAddressFromFactory(tokenAddress: string, networkId: number) {
    return getFactoryContract(networkId).getExchange(tokenAddress)
}