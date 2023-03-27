import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EnvOptions, VocdoniSDKClient } from '@vocdoni/sdk';
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSigner } from 'wagmi';

export default function VocdoniWidget() {
  const router = useRouter();
  const { electionId, handlers, handler, code }: { electionId: string, handlers: string, handler: string, code: string} = router.query as any;

  const { data: signer, isError, isLoading } = useSigner();

  const [profile, setProfile] = useState<any>(null);
  const [vocdoniClient, setVocdoniClient] = useState<any>(null);

  // Vocdoni Client initialization
  useEffect(() => {
    if(!electionId) return;
    if(!signer) return;

    const client = new VocdoniSDKClient({
      env: EnvOptions.DEV,
      wallet: signer, // the signer used (Metamask, Walletconnect)
      electionId: electionId, // The election identifier
      csp_url: process.env.NEXT_PUBLIC_CSP_URL // The CSP url defined when creating an election
    });

    console.log('This is de Vocdoni Client: ', client);

    setVocdoniClient(client);
  }, [signer, electionId]);

  // Listening for the popup window meessage
  useEffect(() => {
    if(window.opener) return;
    window.addEventListener('message', (event) => {
      getOAuthToken(event.data.code, event.data.handler);
    });
  },[]);

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

  const handleServiceClick = async (handler: string) => {
    if(!vocdoniClient){
      alert('Vocdoni client not initialized yet');
      return;
    }

    const redirectURL = `${window.location.href.replace(`&handlers=${handlers}`, `&handler=${handler}`)}`;

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_CSP_URL}/v1/auth/elections/${electionId}/blind/auth/0`,
      { "authData": [handler, redirectURL] }
    );
    console.log('data', data)

    // const step0 = (await vocdoniClient.cspStep(0, [handler, redirectURL])) as ICspIntermediateStepResponse;
    // console.log('data', step0)
    
    openLoginPopup(handler, data.response[0])
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
  const getOAuthToken = async (code: string, handler: string) => {
    if(!code || !handler) return;

    // Remove the code, handler and # from the url
    let redirectURL = window.location.href.replace(`&code=${code}`, '').replace(`&handlers=${handlers}`, `&handler=${handler}`).replace('#', '');

    // Extract the electionId query param from the redirectURL
    const electionId = redirectURL.split('?')[1].split('&').find((param: string) => param.startsWith('electionId='))?.split('=')[1];

    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_CSP_URL}/v1/auth/elections/${electionId}/blind/auth/1`,
      { "authData": [handler, code, redirectURL] }
    );

    // const step1 = (await vocdoniClient.cspStep(1, [handler, code, redirectURL], step0.authToken)) as ICspFinalStepResponse;

    setProfile(JSON.parse(data.response[1]));
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