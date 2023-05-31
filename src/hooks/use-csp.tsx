import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { VocdoniAdminSDKClient } from 'vocdoni-admin-sdk'

export const CspAdminContext = createContext<any>(null)
export const CspAdminProvider = ({ children }: { children: ReactNode }) => {
  const [vocdoniAdminClient, setVocdoniAdminClient] = useState<any>(null)

  useEffect(() => {
    ;(async function iife() {
      setVocdoniAdminClient(new VocdoniAdminSDKClient({ csp_url: process.env.REACT_APP_CSP_URL }))
    })()
  }, [])

  const value = {
    vocdoniAdminClient,
  }
  return <CspAdminContext.Provider value={value}>{children}</CspAdminContext.Provider>
}

export const useCspAdmin = () => {
  const cspAdmin = useContext(CspAdminContext)

  if (!cspAdmin) {
    throw new Error('useCspAdmin() must be used inside an <CspAdminProvider /> declaration')
  }

  return cspAdmin
}
