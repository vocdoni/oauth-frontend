import { useAccount } from 'wagmi'
import Organization from './Organization'
import Connect from './Connect'

const Home = () => {
  const { isConnected } = useAccount()

  return isConnected ? <Organization /> : <Connect />
}

export default Home
