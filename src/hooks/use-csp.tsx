import { PublishedElection } from '@vocdoni/sdk'
import localforage from 'localforage'
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

  const saveAdminToken = async (electionId: string, adminToken: string): Promise<any[]> => {
    let tokens: any[] = (await localforage.getItem('adminTokens')) || []
    tokens.push({ electionId, adminToken })
    return await localforage.setItem('adminTokens', tokens)
  }

  const getAdminToken = async (electionId: string): Promise<string | null> => {
    let tokens: any[] = (await localforage.getItem('adminTokens')) || []
    const token = tokens.find((t) => t.electionId === electionId)
    return token?.adminToken
  }

  const saveElection = async (election: PublishedElection): Promise<any[]> => {
    let elections: any[] = (await localforage.getItem('elections')) || []
    elections.push(election)
    return await localforage.setItem('elections', elections)
  }

  const listElections = async (): Promise<any[] | null> => {
    return localforage.getItem('elections')
  }

  const getElection = async (electionId: string): Promise<string | null> => {
    let elections: any[] = (await localforage.getItem('elections')) || []
    return elections.find((t) => t.electionId === electionId)
  }

  const value = {
    vocdoniAdminClient,
    saveAdminToken,
    getAdminToken,
    saveElection,
    listElections,
    getElection,
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
