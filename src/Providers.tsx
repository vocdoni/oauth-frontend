import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ClientProvider } from '@vocdoni/chakra-components'
import { EnvOptions } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { WagmiConfig, useSigner } from 'wagmi'
import { chains, wagmiClient } from './constants/rainbow'
import { rainbowStyles, theme } from './theme'
import { CspAdminProvider } from './hooks/use-csp'
import { App } from './App'
import { ChakraProvider, ColorModeScript, useColorMode } from '@chakra-ui/react'
import { translations } from './i18n/components'
import { VocdoniEnvironment } from './constants'
import { Signer } from '@ethersproject/abstract-signer'

export const Providers = () => (
  <>
    <ColorModeScript />
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <AppProviders />
      </WagmiConfig>
    </ChakraProvider>
  </>
)

export const AppProviders = () => {
  const { data: signer } = useSigner()
  const { colorMode } = useColorMode()
  const { t } = useTranslation()

  return (
    <RainbowKitProvider chains={chains} theme={rainbowStyles(colorMode)}>
      <CspAdminProvider>
        <ClientProvider env={VocdoniEnvironment as EnvOptions} signer={signer as Signer} translations={translations(t)}>
          <App />
        </ClientProvider>
      </CspAdminProvider>
    </RainbowKitProvider>
  )
}
