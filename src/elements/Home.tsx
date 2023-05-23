import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Select, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useCspAdmin } from '../hooks/use-csp';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

const Home = () => {
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
      error = 'A process is required';
    }
    return error;
  };

  const submit = async (values: any, actions: any) => {
    return navigate(`/process/${values.electionId}`);
  };

  return (
    <VStack spacing={8} mt={14}>
      <Box rounded={'lg'} bgColor={'white'} boxShadow={'lg'} p={[4, 8]} pt={[4, 6]}>
        {adminTokens && adminTokens.length > 0 && (
          <Formik initialValues={{ electionId: '' }} onSubmit={submit}>
            <Form>
              <Field name="electionId" validate={validateElectionId}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl isInvalid={form.errors.electionId && form.touched.electionId}>
                    <FormLabel>Select one of your processes</FormLabel>
                    <Select {...field} placeholder="Select Process">
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
            </Form>
          </Formik>
        )}

        {adminTokens && adminTokens.length > 0 && <FormLabel mt={4}>Or create a new one</FormLabel>}

        <Button width={'full'} type="submit" colorScheme={'blue'} onClick={() => navigate('/process/create')}>
          Create a new Process
        </Button>
      </Box>
    </VStack>
  );
};

export default Home;
