import localforage from 'localforage';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { VocdoniAdminSDKClient } from 'vocdoni-admin-sdk';

export const CspAdminContext = createContext<any>(null);
export const CspAdminProvider = ({ children }: { children: ReactNode }) => {
  const [vocdoniAdminClient, setVocdoniAdminClient] = useState<any>(null);
  const [adminTokens, setAdminTokens] = useState<string[]>([]);

  useEffect(() => {
    (async function iife() {
      setVocdoniAdminClient(new VocdoniAdminSDKClient({ csp_url: process.env.REACT_APP_CSP_URL }));
    })();
  }, []);

  const saveAdminToken = async (electionId: string, adminToken: string): Promise<any[]> => {
    let tokens: any[] = (await localforage.getItem('adminTokens')) || [];
    tokens.push({ electionId, adminToken });
    return await localforage.setItem('adminTokens', tokens);
  };

  const listAdminTokens = async (): Promise<any[] | null> => {
    return localforage.getItem('adminTokens');
  };

  const getAdminToken = async (electionId: string): Promise<string | null> => {
    let tokens: any[] = (await localforage.getItem('adminTokens')) || [];
    const token = tokens.find((t) => t.electionId === electionId);
    return token?.adminToken;
  };

  const value = {
    vocdoniAdminClient,
    saveAdminToken,
    listAdminTokens,
    getAdminToken,
  };
  return <CspAdminContext.Provider value={value}>{children}</CspAdminContext.Provider>;
};

export const useCspAdmin = () => {
  const cspAdmin = useContext(CspAdminContext);

  if (!cspAdmin) {
    throw new Error('useCspAdmin() must be used inside an <CspAdminProvider /> declaration');
  }

  return cspAdmin;
};
