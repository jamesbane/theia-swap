import {useCallback} from 'react';
import {UnsupportedChainIdError, useWeb3React} from '@web3-react/core';
import {InjectedConnector} from "@web3-react/injected-connector";
import {BNB_MAIN_CHAINID, BNB_TEST_CHAINID, ETH_MAIN_CHAINID, ETH_TEST_CHAINID} from "../constants/chains";

const injected = new InjectedConnector({
    supportedChainIds: [BNB_MAIN_CHAINID, BNB_TEST_CHAINID, ETH_MAIN_CHAINID, ETH_TEST_CHAINID],
});

const useAuth = () => {
    const {activate, deactivate} = useWeb3React();

    const login = useCallback(() => {
        activate(injected, async (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
                // const hasSetup = await setupNetwork(chainId);
                // if (hasSetup) {
                //     activate(injected);
                // }
            }
        });
    }, []);

    const logout = useCallback(() => {
        deactivate();
    }, [deactivate]);

    return {login, logout};
};

export default useAuth;
