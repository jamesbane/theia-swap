import React from 'react';
import Layout from "./components/Layout";
import Router from "./routes";
import {BrowserRouter} from "react-router-dom";
import './styles/common.scss'
import 'bootstrap/dist/css/bootstrap.css'
import {createWeb3ReactRoot, Web3ReactProvider} from '@web3-react/core';
import {ethers} from "ethers";
import {ExternalProvider, JsonRpcFetchFunc} from "@ethersproject/providers/src.ts/web3-provider";

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
    const library = new ethers.providers.Web3Provider(provider)
    library.pollingInterval = 10000
    return library
}

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')

function App() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <BrowserRouter>
                    <Layout>
                        <Router/>
                    </Layout>
                </BrowserRouter>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    );
}

export default App;
