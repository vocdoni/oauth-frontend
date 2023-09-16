import { Alert, AlertIcon, Button, Flex, FormControl, FormLabel, useToast } from '@chakra-ui/react'
import { useClient } from '@vocdoni/react-providers'
import { CspCensus, Election, IQuestion, PlainCensus, WeightedCensus } from '@vocdoni/sdk'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import CreateProcessAddresses from './Addresses'
import CreateProcessHeader from './Header'
import CreateProcessQuestions from './Questions'
import CreateProcessSettings from './Settings'
import WrapperFormSection from './WrapperFormSection'
import GithubUserSearch from '../GithubUserSearch'
import { useCspAdmin } from '../../hooks/use-csp'
import { IElection, IElectionWithTokenResponse } from 'vocdoni-admin-sdk'

export interface FormValues {
  title: string
  description: string
  endDate: Date
  startDate: Date
  electionType: {
    autoStart: boolean
    interruptible: boolean
    secretUntilTheEnd: boolean
  }
  maxVoteOverwrites: number
  weightedVote: boolean
  addresses: Address[]
  questions: Question[]
}

export interface Question {
  title: string
  description: string
  options: Option[]
}

export interface Option {
  option: string
}

export interface Address {
  address: string
  weight: number
}

export const getPlainCensus = (addresses: string[]) => {
  const census = new PlainCensus()
  census.add(addresses)

  return census
}
export const getWeightedCensus = (addresses: Address[]) => {
  const census = new WeightedCensus()

  addresses.forEach((add: Address) => {
    census.add({
      key: add.address,
      weight: BigInt(add.weight),
    })
  })

  return census
}

export const ProcessCreateForm = () => {
  const { address } = useAccount()
  const { client } = useClient()
  const [sending, setSending] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const toast = useToast()
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const { vocdoniAdminClient, saveAdminToken } = useCspAdmin()

  const methods = useForm<FormValues>({
    defaultValues: {
      electionType: {
        autoStart: false,
        interruptible: true,
        secretUntilTheEnd: false,
      },
      maxVoteOverwrites: 0,
      weightedVote: false,
      // add two address fields by default
      addresses: [{}, {}],
      questions: [
        {
          // add two options by default
          options: [{}, {}],
        },
      ],
    },
  })

  // fill account address to the census first address field
  useEffect(() => {
    if (!address) return
    methods.setValue(`addresses.${0}.address`, address)
  }, [address, methods])

  const updatedGithubSelection = (users: any) => {
    setSelectedUsers(users)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setError('')
    setSending(true)
    try {
      const election = Election.from({
        ...data,
        maxCensusSize: 100, //TODO: make this configurable
        census: new CspCensus(
          import.meta.env.REACT_APP_CSP_PUBKEY as string,
          import.meta.env.REACT_APP_CSP_URL as string
        ),
        // map questions back to IQuestion[]
        questions: data.questions.map(
          (question) =>
            ({
              title: { default: question.title },
              description: { default: question.description },
              choices: question.options.map((q: Option, i: number) => ({
                title: { default: q.option },
                value: i,
              })),
            } as IQuestion)
        ),
        startDate: data.electionType.autoStart ? undefined : new Date(data.startDate).getTime(),
        endDate: new Date(data.endDate).getTime(),
        voteType: { maxVoteOverwrites: Number(data.maxVoteOverwrites) },
      })

      const pid = await client.createElection(election)
      toast({
        title: t('form.process_create.success_title'),
        description: t('form.process_create.success_description'),
        status: 'success',
        duration: 4000,
      })

      // Setting up the CSP for the created election
      const eId = `0x${pid}`
      const createdCspElection: IElectionWithTokenResponse = await createElectionInCsp(pid)
      await saveAdminToken(eId, createdCspElection.adminToken)

      setTimeout(() => navigate(`/processes/${eId}`), 3000)
    } catch (err: any) {
      if ('message' in err) {
        setError(err.message)
      }
      console.error('could not create election:', err)
    } finally {
      setSending(false)
    }
  }

  const createElectionInCsp = async (electionId: string): Promise<IElectionWithTokenResponse> => {
    if (!vocdoniAdminClient) throw new Error('Vocdoni Admin Client not initialized')

    const cspElection: IElection = {
      electionId: electionId,
      handlers: [
        {
          handler: 'oauth',
          service: 'github',
          mode: 'usernames',
          data: selectedUsers.map((user) => user.login),
        },
      ],
    }

    return await vocdoniAdminClient.cspElectionCreate(cspElection)
  }

  return (
    <FormProvider {...methods}>
      <Flex as='form' direction='column' gap={4} onSubmit={methods.handleSubmit(onSubmit)}>
        <CreateProcessHeader />
        <CreateProcessSettings />
        <CreateProcessAddresses />
        <CreateProcessQuestions />

        <WrapperFormSection>
          <FormControl mb={4}>
            <FormLabel fontSize='1.3em'>{t('form.process_create.select_github_users')}</FormLabel>
            <GithubUserSearch onUpdateSelection={updatedGithubSelection} showSelectedList={true} />
          </FormControl>
        </WrapperFormSection>

        {error.length > 0 && (
          <Alert status='error'>
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Button type='submit' isLoading={sending} disabled={sending}>
          {t('form.process_create.submit')}
        </Button>
      </Flex>
    </FormProvider>
  )
}
