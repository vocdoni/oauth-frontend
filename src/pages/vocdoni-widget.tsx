import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EnvOptions, VocdoniSDKClient, Vote } from '@vocdoni/sdk';
import { Signer, Wallet } from 'ethers';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount, useSigner } from 'wagmi';

export default function VocdoniWidget() {
  const router = useRouter();
  const { electionId, handlers, handler, code }: { electionId: string, handlers: string, handler: string, code: string} = router.query as any;

  const { data: signer, isError, isLoading } = useSigner();
  const { address } = useAccount();

  const [profile, setProfile] = useState<any>(null);
  const [vocdoniClient, setVocdoniClient] = useState<any>(null);
  const [authToken, setAuthToken] = useState<any>(null);

  // Vocdoni Client initialization
  useEffect(() => {
    if(!electionId) return;
    if(!signer) return;

    setVocdoniClient(initVocdoniClient(signer, electionId));
  }, [signer, electionId]);

  // Listening for the popup window meessage
  useEffect(() => {
    if(window.opener) return;
    if(!vocdoniClient) return;

    window.addEventListener('message', (event) => {
      if(event.data.code && event.data.handler){
        getOAuthToken(vocdoniClient, event.data.code, event.data.handler);
      }
    });
  },[vocdoniClient]);

  // Posting the message to the main window
  useEffect(() => {
    (async () => {
      if(!code || !handler) return;

      if(window.opener) {
        // If it is, send the code to the parent window and close the popup
        window.opener.postMessage({ code, handler }, '*');
        window.close();
      }
    })()
  }, [code, handler]); 

  const initVocdoniClient = (signer: Wallet | Signer, electionId: string) => {
    return new VocdoniSDKClient({
      env: EnvOptions.DEV,
      wallet: signer, // the signer used (Metamask, Walletconnect)
      electionId: electionId, // The election identifier
      csp_url: process.env.NEXT_PUBLIC_CSP_URL // The CSP url defined when creating an election
    });
  }

  const handleServiceClick = async (handler: string) => {
    if(!vocdoniClient){
      alert('Vocdoni client not initialized yet');
      return;
    }

    const redirectURL = `${window.location.href.replace(`&handlers=${handlers}`, `&handler=${handler}`)}`;

    const step0 = await vocdoniClient.cspStep(0, [handler, redirectURL]);

    setAuthToken(step0.authToken);
    openLoginPopup(handler, step0['response'][0])
  }

  // Opens a popup window to the service login page
  const openLoginPopup = (handler: string, url: string) => {
    const width = 600;  
    const height = 600;
    const left = (window.outerWidth / 2) - (width / 2);
    const top = (window.outerHeight / 2) - (height / 2);
    const params = [
      `width=${width}`,
      `height=${height}`,
      `top=${top}`,
      `left=${left}`,
      `status=no`,
      `resizable=yes`,
      `scrollbars=yes`,
    ].join(',');

    window.open(url, handler, params);
  }

  // Exchange the provided code for the oAuth token
  const getOAuthToken = async (vocdoniClient: any, code: string, handler: string) => {
    if(!code || !handler) return;

    // Extract the electionId query param from the redirectURL
    const electionId = window.location.href.split('?')[1].split('&').find((param: string) => param.startsWith('electionId='))?.split('=')[1];

    let redirectURL = `${window.location.href.split('?')[0]}?electionId=${electionId}&handler=${handler}`;
    let step1;
    try {
      step1 = await vocdoniClient.cspStep(1, [handler, code, redirectURL], authToken);
    } catch(e) {
      console.log(e);
      alert("Ooops! Looks like you are not in the census!");
    }
    
    setProfile(JSON.parse(step1.response[1]));

    signAndVote(step1.token);   
  }

  const signAndVote = async (token: string) => {
    if(!address){
      console.error('No address found');
      return;
    }

    // Get the blind signature
    const signature = await vocdoniClient.cspSign(address, token);

    // Get the vote based on the signature
    const vote = vocdoniClient.cspVote(new Vote([1]), signature);

    // Vote
    const voteId = await vocdoniClient.submitVote(vote);
  }

  return (<div>

    {!signer && <>
      <ConnectButton />
    </>}

    {signer && vocdoniClient && <>
      {!profile && handlers && <ul>
        {handlers?.split(',').map((h: any, i: number) => (
          <li key={i}>
            <button onClick={() => handleServiceClick(h)}>{h}</button>
          </li>
        ))}
      </ul>}

      {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
    </>}
  </div>)
}