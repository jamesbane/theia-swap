import {ethers} from "ethers"
import moment from "moment";

export const getBlockWithDate = async (date: number, provider: ethers.providers.JsonRpcProvider) => {
    const firstBlock = await provider.getBlock(1)
    const lastBlock = await provider.getBlock('latest')

    const blockTime = (lastBlock.timestamp - firstBlock.timestamp) / lastBlock.number
    return Math.ceil(moment.unix(date).diff(moment.unix(firstBlock.timestamp), 'seconds') / blockTime)
}