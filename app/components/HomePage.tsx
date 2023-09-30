import React, { useState, useEffect } from 'react';
import { Card, Button, TextInput, Modal, Tooltip } from "flowbite-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetwork, useBalance, useAccount, useDisconnect, useToken } from 'wagmi';
import { BigNumber } from 'ethers';
import { FetchTokenResult, FetchBalanceResult } from '@wagmi/core';

export default function Index(): JSX.Element {

  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState<`0x${string}` | undefined>();
  const [balance, setBalance] = useState<string>();
  const [status, setStatus] = useState('')
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({ address: account })

  useEffect(() => {
    disconnect()
  }, [])

  useEffect(() => {
    if (chain != undefined) {
      setConnected(true)
      address && setAccount(address);
      if (data?.formatted) setBalance(data.formatted);
      if (isLoading) setStatus('loading');
    }
  }, [chain, address])

  console.log('== data --', data, '== address ==', account, '== CHR ==')

  const handleSend = () => {

  }

  return (
    <div className="p-6">
      <section>
        <header>
          <h1 className="mb-6 text-center text-5xl font-extrabold dark:text-white">
            Welcome to <code>TestProject</code> for <code>Chromaway</code>!
          </h1>
        </header>
        <main className="flex justify-center p-6">
          <Card className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2">
            <p className="text-center font-bold text-xl dark:text-white pb-3 border-b-2">Send Cryptocurrencies</p>
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">

              {/* <div className="flex justify-between align-item-center p-3">
                <div className='dark:text-white'>Balance</div>
                <div className='dark:text-white'>Balance</div>
              </div> */}
            </div>
            <div className='flex justify-center'>
              <ConnectButton label='Connect Wallet' />
            </div>
            <div className={isConnected ? "flex justify-between align-item-center p-3" : 'hidden'}>
              <div className='dark:text-white'>CHR Token</div>
              <div className='dark:text-white text-right'>0</div>
            </div>
            <TextInput type={'number'} className={isConnected ? 'block' : 'hidden'} />
            <Button onClick={() => handleSend()} className="bg-primary hover:opacity-80 hover:bg-primary">
              <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Send
            </Button>
          </Card>
        </main>
        {/* <Modal show={isOpen} size={'lg'}>
          <div className="relative w-full max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="crypto-modal" onClick={() => setOpen(false)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                  Connect wallet
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers or create a new one.</p>
                <div className="my-4 flex justify-around flex-row items-center">
                  <Tooltip content='Ethereum'>
                    <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                      <Image src={'/eth.png'} width={50} height={50} alt='ethereum logo' />
                    </div>
                  </Tooltip>
                  <Tooltip content='Binance Testnet'>
                    <div className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                      <Image src={'/bnb.png'} width={50} height={50} alt='bnb logo' />
                    </div>
                  </Tooltip>
                </div>
                <div>
                  <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                    <svg className="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Why do I need to connect with my wallet?</a>
                </div>
              </div>
            </div>
          </div>
        </Modal> */}
      </section>
    </div>
  );
}
