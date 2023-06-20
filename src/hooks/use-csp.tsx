import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { CspAdminClientOptions, VocdoniAdminSDKClient } from 'vocdoni-admin-sdk'
import { Wallet, Signer } from 'ethers'
import localforage from 'localforage'

export const CspAdminContext = createContext<any>(null)

export type CspAdminProviderProps = {
  children?: ReactNode
  signer?: Wallet | Signer
}

export const CspAdminProvider = ({ children, signer }: CspAdminProviderProps) => {
  const [vocdoniAdminClient, setVocdoniAdminClient] = useState<any>(null)

  useEffect(() => {
    ;(async function iife() {
      const opts: CspAdminClientOptions = {
        cspUrl: process.env.REACT_APP_CSP_URL + '/auth/elections/admin',
      }

      if (signer) {
        opts.wallet = signer as Wallet | Signer
      }

      setVocdoniAdminClient(new VocdoniAdminSDKClient(opts))
    })()
  }, [signer])

  const saveAdminToken = async (electionId: string, adminToken: string): Promise<any[]> => {
    let tokens: any[] = (await localforage.getItem('adminTokens')) || []
    tokens.push({ electionId, adminToken })
    return await localforage.setItem('adminTokens', tokens)
  }

  const getAdminToken = async (electionId: string): Promise<string | null> => {
    let tokens: any[] = (await localforage.getItem('adminTokens')) || []
    const token = tokens.find((t) => t.electionId === electionId)

    // If it's in memory return it
    if (token?.adminToken) {
      return token?.adminToken
    }

    // Force user auth to get the token
    try {
      const res = await vocdoniAdminClient.cspElectionAuth(
        electionId,
        JSON.stringify({ election: electionId, random: Math.random() })
      )
      saveAdminToken(electionId, res.adminToken)
      return res.adminToken
    } catch (e) {
      console.log(e)
    }

    return null
  }

  const value = {
    vocdoniAdminClient,
    saveAdminToken,
    getAdminToken,
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
