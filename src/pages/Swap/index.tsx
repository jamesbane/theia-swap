import style from "./Swap.module.scss"
import Panel from "../../components/Panel"
import {Button, FormControl} from "react-bootstrap"
import Select from 'react-select'
import {BNB_MAIN_CHAINID, chainInfo, chainList, ETH_MAIN_CHAINID} from "../../constants/chains";
import cn from "classnames";
import {useEffect, useState} from "react";
import axios from "axios";
import {useWeb3React} from "@web3-react/core";
import useAuth from "../../hooks/useAuth";
import {getTokenExchangeAddressFromFactory} from "../../utils";
import {getExchangeContract} from "../../hooks/useExchangeContract";
import {ethers} from "ethers";

const Swap = () => {
    const {login} = useAuth()
    const {library, account, chainId} = useWeb3React()
    const [tokenList, setTokenList] = useState(null)
    const [fromChainId, setFromChainId] = useState(BNB_MAIN_CHAINID)
    const [fromToken, setFromToken] = useState<any>(null)
    const [fromAmount, setFromAmount] = useState('0')
    const [receiptAddress, setReceiptAddress] = useState('')
    const [toChainId, setToChainId] = useState(ETH_MAIN_CHAINID)
    const [toToken, setToToken] = useState<any>(null)
    const customStyles = {
        menu: (provided: any, state: any) => ({
            ...provided,
            color: 'black',
        }),
    }

    const getTokenList = () => {
        axios.get('https://bridgeapi.anyswap.exchange/data/router/pools').then(res => {
            setTokenList(res.data)
        })
    }

    useEffect(() => {
        getTokenList()
    }, [])

    useEffect(() => {
        if (tokenList) {
            const fromToken = getTokenForChain(fromChainId)[0]
            setFromToken(fromToken);
        }
    }, [fromChainId, tokenList])

    useEffect(() => {
        if (tokenList) {
            const toToken = getTokenForChain(toChainId)[0]
            setToToken(toToken)
        }
    }, [toChainId, tokenList])

    const getTokenForChain = (chainId: number) => {
        if (tokenList) {
            return Object.keys(tokenList[chainId]).map(key => ({
                key: key,
                ...(tokenList[chainId][key] as any)
            }))
        }
        return []
    }

    const onSwap = async () => {
        const deadline = Math.ceil(Date.now() / 1000) + 60 * 15
        let contract, method, args
        if (chainId) {
            try {
                Promise.all([getTokenExchangeAddressFromFactory(fromToken.anyToken, fromChainId).catch(() => null), getTokenExchangeAddressFromFactory(toToken.anyToken, toChainId).catch(() => null)])
                    .then(([fromExchangeAddress, toExchangeAddress]) => {
                        console.log(fromExchangeAddress, toExchangeAddress)

                        contract = getExchangeContract(fromExchangeAddress, library, account)
                        method = contract.tokenToTokenTransferInput
                        args = [
                                ethers.utils.parseUnits(fromAmount, fromToken.decimals),
                                0,
                                ethers.constants.One,
                                deadline,
                                receiptAddress,
                                toToken.symbol
                            ]

                        method(...args)
                    })
            } catch (e: any) {
                console.log(e.message)
            }

        }
    }

    const onConnectWallet = () => {
        login()
    }
    return (
        <div>
            <div className={style.swapTitle}>USDC/ETH Swapping Events</div>


            {account && <div>Wallet Address: {account}</div>}
            <Panel>
                <h5>From</h5>

                <div className={'d-flex'}>
                    <FormControl
                        placeholder="0.00"
                        pattern={'^[0-9]*[.,]?[0-9]*$'}
                        id={'fromAmount'}
                        className={'flex-2 me-5'}
                        onChange={(e) => setFromAmount(e.target.value)}
                    />

                    <Select
                        id={'fromChainId'}
                        className={'flex-1 me-2'}
                        defaultValue={fromToken}
                        options={getTokenForChain(fromChainId)}
                        isSearchable
                        styles={customStyles}
                        getOptionLabel={(option: any) => option ? `${option.symbol} - ${option.name}` : ''}
                        getOptionValue={(option: any) => option ? `${option.key}` : ''}
                        onChange={(option) => setFromToken(option)}
                    />

                    <Select
                        id={'fromChainId'}
                        className={'flex-1 mw-2'}
                        options={chainList}
                        defaultValue={chainInfo[BNB_MAIN_CHAINID]}
                        isDisabled
                        isSearchable
                        styles={customStyles}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => `${option.chainID}`}
                        onChange={(option: any) => setFromChainId(option.chainID)}
                    />
                </div>
            </Panel>

            <Panel>
                <h5>To</h5>
                <div className={'d-flex'}>
                    <FormControl
                        placeholder="0.00"
                        pattern={'^[0-9]*[.,]?[0-9]*$'}
                        id={'toAmount'}
                        className={'flex-2 me-5'}
                        readOnly
                    />
                    <Select
                        id={'toTokenId'}
                        className={cn('flex-1 me-2', style.tokenSelector)}
                        defaultValue={getTokenForChain(toChainId).length > 0 ? getTokenForChain(toChainId)[0] : null}
                        options={getTokenForChain(toChainId)}
                        isSearchable
                        styles={customStyles}
                        getOptionLabel={(option: any) => option ? `${option.symbol} - ${option.name}` : ''}
                        getOptionValue={(option: any) => option ? `${option.key}` : ''}
                        onChange={(option) => setToToken(option)}
                    />

                    <Select
                        id={'toChainId'}
                        className={'flex-1 mw-2'}
                        defaultValue={chainInfo[ETH_MAIN_CHAINID]}
                        options={chainList}
                        isDisabled
                        isSearchable
                        styles={customStyles}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => `${option.chainID}`}
                        onChange={(option: any) => setToChainId(option.chainID)}
                    />
                </div>
            </Panel>

            <Panel>
                <h5>Receipt Wallet Address</h5>
                <FormControl
                    placeholder="Receipt Address"
                    id={'receipt'}
                    onChange={(e) => setReceiptAddress(e.target.value)}

                />
            </Panel>


            <div className={'text-center mt-2'}>
                {account ?
                    <Button onClick={onSwap}>Swap</Button>
                    : <Button onClick={onConnectWallet}>Connect Wallet</Button>}
            </div>
        </div>
    )
}

export default Swap;