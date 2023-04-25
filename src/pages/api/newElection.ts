// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Election, EnvOptions, VocdoniSDKClient, CspCensus } from '@vocdoni/sdk';

import { Wallet } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const wallet = Wallet.createRandom();
  const client = new VocdoniSDKClient({
    env: EnvOptions.DEV,
    wallet,
    csp_url: process.env.NEXT_PUBLIC_CSP_URL,
  });

  const election = Election.from({
    title: 'Election title',
    description: 'Election description',
    header: 'https://source.unsplash.com/random',
    endDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
    maxCensusSize: 100,
    census: new CspCensus(process.env.NEXT_PUBLIC_CSP_PUBKEY as string, process.env.NEXT_PUBLIC_CSP_URL as string)
  });

  const question = {
    title: 'This is a question',
    description: 'This is a description',
    options: [
      {
        title: 'Option 1',
        value: 1
      },
      {
        title: 'Option 2',
        value: 2
      },
      {
        title: 'Option 3',
        value: 2
      }
    ]
  }

  election.addQuestion(question.title, question.description, question.options);

  await client.createAccount();
  const electionId = await client.createElection(election);

  res.status(200).json({ electionId, question })
}
