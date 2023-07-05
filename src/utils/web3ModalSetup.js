import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

/**
  Web3 modal helps us "connect" external wallets:
**/
const web3ModalSetup = () =>
  new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: '88b3ca144c6648df843909df0371ee08', // required
          rpc: {
            56: 'https://bsc-dataseed1.binance.org' // BSC Mainnet RPC
          },
        },
      },
    },
  });

export default web3ModalSetup;
