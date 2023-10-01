import React, { useState, useEffect } from 'react';
import { Card, Button, TextInput, } from "flowbite-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetwork, useAccount, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi';
import ABI from '../config/abi.json'
import { TOKEN_ADDRESS, TEST_TOKEN_ADDRESS, EtherChainId, bscTestChainId } from '../config/index'
import { createPublicClient, http, createWalletClient, custom, parseEther  } from 'viem'
import { mainnet, bscTestnet } from 'viem/chains'
import { fetchBalance } from '@wagmi/core'
import { useDebounce } from 'use-debounce'

type Address = `0x${string}`
type CryptoInfo = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}
declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Index(): JSX.Element {

  const [isConnected, setConnected] = useState(false);
  const [status, setStatus] = useState('')
  const [receiver, setReceiver] = useState('')
  const [sendAmount, setSendAmount] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [etherToken, setEtherToken] = useState(0)
  const [bscTestToken, setBscTestToken] = useState(0)
  const [cryptoInfo, setCryptoInfo] = useState<CryptoInfo>({ decimals: 0, formatted: '', symbol: '', value: 0n })
  const [cryptoValue, setCryptoValue] = useState(0)
  const [cryptoReceiver, setCryptoReceiver] = useState('')
  const [cryptoButtonDisable, setCryptoButtonDisable] = useState(false)

  const [debouncedTo] = useDebounce(cryptoReceiver, 500)
  const [debouncedAmount] = useDebounce(cryptoValue, 500)

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? parseEther(debouncedAmount.toString()) : undefined,
  })
  const { data, sendTransaction } = useSendTransaction(config)
  
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  if(isSuccess){
    setCryptoValue(0)
    setCryptoReceiver('')
  }
  const etherPublicClient = createPublicClient({
    chain: mainnet,
    transport: http()
  })
  const bscTestPublicClient = createPublicClient({
    chain: bscTestnet,
    transport: http()
  })
  const etherWalletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum)
  })
  const bscTestnetWalletClient = createWalletClient({
    chain: bscTestnet,
    transport: custom(window.ethereum)
  })

  async function getTokenBalance(accountAddress: Address): Promise<any> {
    try {
      let balance: string;
      if (chain != undefined && chain.id == EtherChainId) {
        //@ts-ignore
        balance = await etherPublicClient.readContract({
          address: TOKEN_ADDRESS,
          abi: ABI,
          functionName: 'balanceOf',
          args: [accountAddress]
        })
        if (!parseInt(balance) && status == 'Send') setDisabled(true)
        setEtherToken(parseInt(balance))
      }
      if (chain != undefined && chain.id == bscTestChainId) {
        //@ts-ignore
        balance = await bscTestPublicClient.readContract({
          address: TEST_TOKEN_ADDRESS,
          abi: ABI,
          functionName: 'balanceOf',
          args: [accountAddress]
        })
        if (!parseInt(balance) && status == 'Send') setDisabled(true)
        setBscTestToken(parseInt(balance))
      }
    } catch (error) {
      console.log('== error while getting token balance ==', error)
    }
  }

  const handleChangeValue = (value: string) => {
    const floatValue = parseFloat(value)
    if (chain?.id == EtherChainId) {
      if (floatValue * 10 ** 6 > etherToken) setDisabled(true)
      else { setSendAmount(floatValue * 10 ** 6); setDisabled(false) }
    }
    if (chain?.id == bscTestChainId) {
      if (floatValue * 10 ** 6 > bscTestToken) setDisabled(true)
      else { setSendAmount(floatValue * 10 ** 6); setDisabled(false) }
    }
  }
  const checkAllow = async () => {
    if (chain?.id == EtherChainId) {
      // @ts-ignore
      const allowedValue = await etherPublicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: ABI,
        functionName: 'allowance',
        args: [address, TOKEN_ADDRESS]
      })
      if (allowedValue == 0) setStatus('Allow')
      else setStatus('Send');
    }
    if (chain?.id == bscTestChainId) {
      // @ts-ignore
      const allowedValue = await bscTestPublicClient.readContract({
        address: TEST_TOKEN_ADDRESS,
        abi: ABI,
        functionName: 'allowance',
        args: [address, TEST_TOKEN_ADDRESS]
      })
      if (allowedValue == 0) setStatus('Allow')
      else setStatus('Send');
    }
  }
  const getCryptoInfo = async() => {
      const info = await fetchBalance({address: address!, chainId: chain?.id})
      setCryptoInfo(info);
  }

  useEffect(() => {
    if (chain != undefined) {
      setConnected(true)
      setDisabled(false);
      setStatus('Allow');
      checkAllow()
      getCryptoInfo()
      if (address && address != '0x0000') getTokenBalance(address)
    }
    else {
      setConnected(false)
      setDisabled(true);
    }
  }, [chain, address])

  const handleAllow = async () => {
    if (chain?.id == EtherChainId) {
      // @ts-ignore
      const { request } = await etherPublicClient.simulateContract({
        address: TOKEN_ADDRESS,
        abi: ABI,
        functionName: 'approve',
        account: address,
        args: [TOKEN_ADDRESS, 10 ** 30]
      })
      // @ts-ignore
      const result = await etherWalletClient.writeContract(request)
      setStatus('Send')
    }
    if (chain?.id == bscTestChainId) {
      // @ts-ignore
      const { request } = await bscTestPublicClient.simulateContract({
        address: TEST_TOKEN_ADDRESS,
        abi: ABI,
        functionName: 'approve',
        account: address,
        args: [TEST_TOKEN_ADDRESS, 10 ** 30]
      })
      // @ts-ignore
      const result = await bscTestnetWalletClient.writeContract(request)
      setStatus('Send')
    }
  }
  const handleSend = async () => {
    if (!receiver.startsWith('0x')) {
      window.alert('Invalid Address')
      return;
    }
    if (chain?.id == EtherChainId) {
      // @ts-ignore
      const { request } = await etherPublicClient.simulateContract({
        account: address,
        address: TOKEN_ADDRESS,
        abi: ABI,
        functionName: 'transfer',
        args: [receiver, sendAmount * 10 ** 6]
      })
      // @ts-ignore
      const result = await etherWalletClient.writeContract(request)
      setReceiver('')
      setSendAmount(0)
    }
    if (chain?.id == bscTestChainId) {
      // @ts-ignore
      const { request } = await bscTestPublicClient.simulateContract({
        account: address,
        address: TEST_TOKEN_ADDRESS,
        abi: ABI,
        functionName: 'transfer',
        args: [receiver, sendAmount * 10 ** 6]
      })
      // @ts-ignore
      const result = await bscTestnetWalletClient.writeContract(request)
      setReceiver('')
      setSendAmount(0)
    }
  }

  const handleChangeCryptoValue = (value: string) => {
    const floatValue = parseFloat(value)
    if (floatValue < (cryptoInfo?.formatted || 0)) {
      setCryptoButtonDisable(false);
      setCryptoValue(floatValue)
    }
    else {
      setCryptoButtonDisable(true);
    }
  }
  return (
    <div className="md:p-6">
      <section>
        <header>
          <h1 className="mb-6 text-center text-5xl font-extrabold dark:text-white">
            Welcome to <code>TestProject</code> for <code>Chromaway</code>!
          </h1>
        </header>
        <main className="flex justify-center p-0 lg:p-6">
          <Card className="w-full sm:w-full md:w-10/12 lg:w-1/2">
            <p className="text-center font-bold text-xl dark:text-white pb-3 border-b-2">Send Cryptocurrencies</p>
            <div className='flex justify-center'>
              <ConnectButton label='Connect Wallet' />
            </div>
            <div className={isConnected ? "flex justify-between align-item-center p-3" : 'hidden'}>
              <div className='dark:text-white font-bold'>CHR Token</div>
              <div className='dark:text-white font-bold text-right'>{chain?.id == EtherChainId ? (etherToken).toLocaleString() : (bscTestToken / (10 ** 6)).toLocaleString()}</div>
            </div>
            <TextInput type={'number'} disabled={status == 'Allow' ? true : false} className={isConnected ? 'block' : 'hidden'} max={chain?.id == EtherChainId ? etherToken / (10 ** 6) : bscTestToken / (10 ** 6)} defaultValue={(sendAmount).toString()} onChange={(e) => handleChangeValue(e.target.value)} />
            <TextInput type={'string'} disabled={status == 'Allow' ? true : false} placeholder={'Receiver'} className={isConnected ? 'block' : 'hidden'} onChange={(e) => setReceiver(e.target.value)} />
            <Button disabled={disabled} onClick={status == 'Allow' ? () => handleAllow() : () => handleSend()} className={isConnected ? "bg-primary hover:opacity-80 hover:bg-primary" : 'hidden'}>
              <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {status}
            </Button>
            {/* Send Crypto part */}
            <TextInput type={'number'} className={isConnected ? 'block' : 'hidden'} max={chain?.id == EtherChainId ? etherToken / (10 ** 6) : bscTestToken / (10 ** 6)} defaultValue={0} onChange={(e) => handleChangeCryptoValue(e.target.value)} />
            <TextInput type={'string'} placeholder={'Receiver'} className={isConnected ? 'block' : 'hidden'} onChange={(e) => setCryptoReceiver(e.target.value)} />
            <Button disabled={cryptoButtonDisable} onClick={() => sendTransaction?.()} className={isConnected ? "bg-primary hover:opacity-80 hover:bg-primary" : 'hidden'}>
              <svg aria-hidden="true" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {isLoading? 'Sending...': 'Send Crypto'}
            </Button>
          </Card>
        </main>
        
      </section>
    </div>
  );
}
