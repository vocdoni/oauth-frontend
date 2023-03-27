import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function VocdoniWidget() {
  const router = useRouter();
  const { electionId, handlers, handler, code }: { electionId: string, handlers: string, handler: string, code: string} = router.query as any;

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if(!electionId) return;
    if(window.opener) return;

    // Check if there's a message from the popup window
    window.addEventListener('message', (event) => {
      getOAuthToken(event.data.code, event.data.handler);
    });
  },[electionId]);

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
    const redirectURL = `${window.location.href.replace(`&handlers=${handlers}`, `&handler=${handler}`)}`;
    const { data } = await axios.post(
      `http://localhost:5000/v1/auth/elections/${electionId}/blind/auth/0`,
      { "authData": [handler, redirectURL] }
    );

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
      `http://localhost:5000/v1/auth/elections/${electionId}/blind/auth/1`,
      { "authData": [handler, code, redirectURL] }
    );

    setProfile(JSON.parse(data.response[1]));
  }

  return (<div>
    {!profile && handlers && <ul>
      {handlers?.split(',').map((h: any, i: number) => (
        <li key={i}>
          <button onClick={() => handleServiceClick(h)}>{h}</button>
        </li>
      ))}
    </ul>}

    {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>
    }
  </div>)
}