import { ClientProvider } from '@vocdoni/react-components';
import { EnvOptions } from '@vocdoni/sdk';
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { ethers } from 'ethers';

export default function App({ Component, pageProps }: AppProps) {
  const wallet: any = ethers.Wallet.createRandom();

  return (
    <ChakraProvider>
      <ClientProvider env={"dev" as EnvOptions} signer={wallet}>
        <Component {...pageProps} />
      </ClientProvider>
    </ChakraProvider>
  );
}