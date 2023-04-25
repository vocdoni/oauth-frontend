import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { EnvOptions, VocdoniSDKClient, Vote } from '@vocdoni/sdk';

export default function VocdoniWidget() {
  const router = useRouter();
  const { electionId, handlers, handler, code }: { electionId: string, handlers: string, handler: string, code: string} = router.query as any;

  const [profile, setProfile] = useState<any>(null);
  const [election, setElection] = useState<any>(null);
  const [vocdoniClient, setVocdoniClient] = useState<any>(null);
  const [authToken, setAuthToken] = useState<any>(null);

  // Vocdoni Client initialization
  useEffect(() => {
    if(!electionId) return;
    setVocdoniClient(initVocdoniClient(electionId)); 
  }, [electionId]);

  // Listening for the popup window meessage
  useEffect(() => {
    (async () => {
      if(window.opener) return;
      if(!vocdoniClient) return;

      // TODO: Get the election data
      const el = await vocdoniClient.fetchElection(electionId);
      setElection(el);

      // Listen to messages from child window (oauth flows)
      window.addEventListener('message', (event) => {
        if(event.data.code && event.data.handler){
          getOAuthToken(vocdoniClient, event.data.code, event.data.handler);
        }
      });
    })()
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

  const initVocdoniClient = (electionId: string) => {
    const client = new VocdoniSDKClient({
      env: EnvOptions.DEV,
      electionId: electionId, // The election identifier
      csp_url: process.env.NEXT_PUBLIC_CSP_URL // The CSP url defined when creating an election
    });
    const privateKey = client.generateRandomWallet();

    return client
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

  // Verify it's in the census
  const getOAuthToken = async (vocdoniClient: any, code: string, handler: string) => {
    if(!code || !handler) return;

    // Extract the electionId query param from the redirectURL
    const electionId = window.location.href.split('?')[1].split('&').find((param: string) => param.startsWith('electionId='))?.split('=')[1];

    let redirectURL = `${window.location.href.split('?')[0]}?electionId=${electionId}&handler=${handler}`;
    let step1;
    try {
      step1 = await vocdoniClient.cspStep(1, [handler, code, redirectURL], authToken);
    } catch(e) {
      alert("Ooops! Looks like you are not in the census!");
      return false;
    }
    
    setProfile(JSON.parse(step1.response[1]));

    try{
      signAndVote(step1.token);   
    }catch(e){
      alert("Ooops! There was a problem voting!");
      return false;
    }
  }

  const signAndVote = async (token: string) => {
    if(!vocdoniClient){
      console.error('No address found');
      return;
    }

    // Get the blind signature
    const signature = await vocdoniClient.cspSign(await vocdoniClient.wallet.getAddress(), token);

    // Get the vote based on the signature
    const vote = vocdoniClient.cspVote(new Vote([0]), signature);

    // Vote
    const voteId = await vocdoniClient.submitVote(vote);
    console.log('Vote id: ', voteId);
  }

  return (<div>
    {vocdoniClient && <>
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