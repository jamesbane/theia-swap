import {useEffect, useState} from "react"
import {getContract} from "../../utils/getContract"
import poolABI from "../../abi/poolABI.json"

import style from './EventFilter.module.scss'
import Panel from "../../components/Panel"
import moment from "moment-timezone"
import {ethers} from "ethers"
import getProvider from "../../utils/getProvider";
import {getBlockWithDate} from "../../utils/getBlockWithDate";
import InfiniteScroll from "react-infinite-scroll-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EventFilter = () => {
    const [transfers, setTransfers] = useState<any[]>([])
    const [currentBlock, setCurrentBlock] = useState(0)
    const [latestBlock, setlatestBlock] = useState(0)
    const [startDate, setStartDate] = useState(new Date())
    const oneStep = 300

    const loadEvents = async () => {
        const chainId = parseInt(process.env.REACT_APP_NETWORK_ID || '1');
        const provider = getProvider(chainId)
        setTransfers([])
        const startBlockHash = await getBlockWithDate(moment(startDate).tz('GMT').unix(), provider)
        setCurrentBlock(startBlockHash)
        const lastBlock = await provider.getBlock('latest')
        setlatestBlock(lastBlock.number)
        const nextBlockHash = getNextBlockHash(startBlockHash, lastBlock.number)
        loadTransfers(startBlockHash, nextBlockHash)
    }

    const getNextBlockHash = (fromBlock: number, lastBlockHash: number) => {
        const nextBlockHash = fromBlock + oneStep >= lastBlockHash ? lastBlockHash : fromBlock + oneStep
        setCurrentBlock(nextBlockHash)
        return nextBlockHash
    }

    const loadTransfers = (startBlock: number, endBlock: number) => {
        console.log('loadTransfers = ', startBlock, endBlock)
        const chainId = parseInt(process.env.REACT_APP_NETWORK_ID || '1');
        const poolContract = getContract(poolABI, process.env.REACT_APP_USDC_ETH_POOL_ADDRESS!, chainId)
        const filter = poolContract.filters.Swap()
        poolContract.queryFilter(filter, startBlock, endBlock).then(res => {
            const promiseArray = res.map((item) => {
                return new Promise(async (resolve, reject) => {
                    const tx = await item.getTransaction()
                    const block = await item.getBlock()
                    // console.log('block = ', block)
                    const decodedData = item.decode!(item.data, item.topics)
                    const transferData = {
                        from: tx.from,
                        blockHash: tx.blockHash,
                        blockNumber: tx.blockNumber,
                        amount0: ethers.utils.formatUnits(decodedData.amount0, '6'),
                        amount1: ethers.utils.formatUnits(decodedData.amount1),
                        timestamp: block.timestamp
                    }
                    return resolve(transferData)
                })
            })

            if (promiseArray.length > 0) {
                Promise.all(promiseArray).then((newTransfers: any[]) => {
                    setTransfers(prevData => ([
                        ...prevData,
                        ...newTransfers
                    ]))
                })
            }
        })
    }
    useEffect(() => {
        loadEvents()
    }, [startDate])
    return (
        <div className={style.eventWrapper}>
            <div className={'d-flex justify-content-between'}>
                <div className={style.eventTitle}>USDC/ETH Swapping Events</div>
                <div>
                    <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} />
                </div>
            </div>
            <Panel>
                <div className={'row mb-2'}>
                    <div className={'col-1 p-1'}>Block</div>
                    <div className={'col-2 p-1'}>USDC Amount</div>
                    <div className={'col-2 p-1'}>ETH Amount</div>
                    <div className={'col-5 p-1'}>Account</div>
                    <div className={'col-2 p-1'}>Time</div>
                </div>
                <InfiniteScroll
                    dataLength={transfers.length}
                    next={() => loadTransfers(currentBlock + 1, getNextBlockHash(currentBlock, latestBlock))}
                    hasMore={currentBlock < latestBlock}
                    loader={<h4 className={'text-center'}>Loading...</h4>}
                    className={style.scrollWrapper}
                    height={700}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    {transfers.map((item, idx) => (
                        <div key={`event_${idx}`} className={'row'}>
                            <div className={'col-1'}>
                                <a href={`https://etherscan.io/tx/${item.blockHash}`} target={'_blank'}
                                   rel={'noreferrer'}>{item.blockNumber}</a>
                            </div>
                            <div className={'col-2'}>
                                {item.amount0.toString()}
                            </div>
                            <div className={'col-2'}>
                                {item.amount1.toString()}
                            </div>
                            <div className={'col-5'}>
                                <a href={`https://etherscan.io/address/${item.from}`} target={'_blank'}
                                   rel={'noreferrer'}>{item.from}</a>
                            </div>
                            <div className={'col-2'}>
                                {moment.unix(item.timestamp).tz('GMT').format('YYYY.MM.DD hh:mm:ss')}
                            </div>
                        </div>
                    ))}
                </InfiniteScroll>
            </Panel>
        </div>
    )
}

export default EventFilter