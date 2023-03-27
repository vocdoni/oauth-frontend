import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { mainnet, goerli } from 'wagmi/chains';
import { configureChains, createClient } from "wagmi";
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : [mainnet]),
  ],
  [
    publicProvider()
  ]
);
  
const { connectors } = getDefaultWallets({
  appName: 'OAuth Frontend',
  chains
});
  
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})
  
export { wagmiClient, chains };