import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Select, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useCspAdmin } from '../hooks/use-csp'
import { Field, Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { PublishedElection } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { vocdoniAdminClient, listElections } = useCspAdmin()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [elections, setElections] = useState<PublishedElection[]>([])

  useEffect(() => {
    ;(async function iife() {
      if (!vocdoniAdminClient) return

      let electionsList: PublishedElection[] = []
      let rawElectionsList = (await listElections()) || []
      for (let e of rawElectionsList) {
        electionsList.push(
          new PublishedElection({
            id: e._id,
            title: e._title,
            description: e._description,
            header: e._header,
            streamUri: e._streamUri,
            startDate: e._startDate,
            endDate: e._endDate,
            census: e._census,
            voteType: e._voteType,
            electionType: e._electionType,
            questions: e._questions,
            maxCensusSize: e._maxCensusSize,
            organizationId: e._organizationId,
            status: e._status,
            voteCount: e._voteCount,
            finalResults: e._finalResults,
            results: e._results,
            electionCount: e._electionCount,
            creationTime: e._creationTime,
            metadataURL: e._metadataURL,
            raw: e._raw,
          })
        )
      }
      setElections(electionsList)
    })()
  }, [vocdoniAdminClient])

  const validateElectionId = (value: any) => {
    let error
    if (!value) {
      error = 'A process is required'
    }
    return error
  }

  const submit = async (values: any, actions: any) => {
    return navigate(`/process/${values.electionId}`)
  }

  return (
    <VStack spacing={8} mt={14}>
      <Box rounded={'lg'} bgColor={'white'} boxShadow={'lg'} p={[4, 8]} pt={[4, 6]}>
        {elections && elections.length > 0 && (
          <Formik initialValues={{ electionId: '' }} onSubmit={submit}>
            <Form>
              <Field name='electionId' validate={validateElectionId}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl isInvalid={form.errors.electionId && form.touched.electionId}>
                    <FormLabel>{t('home.select_one_of_your_processes')}</FormLabel>
                    {elections && elections.length > 0 && (
                      <Select {...field} placeholder={t('home.select_process')}>
                        {elections.map((e: PublishedElection) => {
                          return (
                            <option key={e.id} value={e.id}>
                              {e.title.default}
                            </option>
                          )
                        })}
                      </Select>
                    )}
                    <FormErrorMessage>{form.errors.electionId}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Flex mt={2} justify={'flex-end'}>
                <Button type='submit' colorScheme={'blue'}>
                  {t('home.go')}
                </Button>
              </Flex>
            </Form>
          </Formik>
        )}

        {elections && elections.length > 0 && <FormLabel mt={4}>{t('or_create_a_new_one')}</FormLabel>}

        <Button width={'full'} type='submit' colorScheme={'blue'} onClick={() => navigate('/process/create')}>
          {t('create_a_new_process')}
        </Button>
      </Box>
    </VStack>
  )
}

export default Home
