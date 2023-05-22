import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Select, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useCspAdmin } from '../hooks/use-csp';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

const Init = () => {
  const { vocdoniAdminClient, listAdminTokens } = useCspAdmin();
  const navigate = useNavigate();

  const [adminTokens, setAdminTokens] = useState<any[]>([]);

  useEffect(() => {
    (async function iife() {
      if (!vocdoniAdminClient) return;

      setAdminTokens(await listAdminTokens());
    })();
  }, [vocdoniAdminClient]);

  const validateElectionId = (value: any) => {
    let error;
    if (!value) {
      error = 'An election is required';
    }
    return error;
  };

  const submit = async (values: any, actions: any) => {
    return navigate(`/${values.electionId}`);
  };

  return (
    <VStack spacing={8}>
      <Box rounded={'lg'} bg={'light'} boxShadow={'lg'} p={[4, 8]} pt={[4, 6]}>
        {adminTokens && adminTokens.length > 0 && (
          <Formik initialValues={{ electionId: '' }} onSubmit={submit}>
            <Form>
              <Field name="electionId" validate={validateElectionId}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl isInvalid={form.errors.electionId && form.touched.electionId}>
                    <FormLabel>Select one of your processes</FormLabel>
                    <Select {...field} placeholder="Select Election">
                      {adminTokens.map((e) => {
                        return (
                          <option key={e.electionId} value={e.electionId}>
                            {e.electionId}
                          </option>
                        );
                      })}
                    </Select>
                    <FormErrorMessage>{form.errors.electionId}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Flex mt={2} justify={'flex-end'}>
                <Button type="submit" colorScheme={'blue'}>
                  Go
                </Button>
              </Flex>

              {/* <FormControl id="init" isRequired>
                {adminTokens && adminTokens.length > 0 && (
                  <>
                    <FormLabel>Select one of your processes</FormLabel>
                    <Select placeholder="Select Election">
                      {adminTokens.map((e) => {
                        return (
                          <option key={e.electionId} value={e.electionId}>
                            {e.electionId}
                          </option>
                        );
                      })}
                    </Select>
                  </>
                )}
              </FormControl> */}
            </Form>
          </Formik>
        )}

        {adminTokens && adminTokens.length > 0 && <FormLabel mt={4}>Or create a new one</FormLabel>}

        <a href="/create">
          <Button width={'full'} type="submit" colorScheme={'blue'}>
            Create a new Process
          </Button>
        </a>
      </Box>
    </VStack>
  );
};

export default Init;
