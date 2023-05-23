import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Textarea } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useCspAdmin } from '../hooks/use-csp';
import { useState } from 'react';
import { IElection, IElectionCreated } from 'vocdoni-admin-sdk';

const ProcessCreate = () => {
  const { vocdoniAdminClient, saveAdminToken } = useCspAdmin();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateElectionId = (value: any) => {
    let error;
    if (!value) {
      error = 'ElectionId is required';
    }
    return error;
  };

  const validateHandlers = (value: any) => {
    let error;
    if (!value) {
      error = 'Handlers is required';
    }
    return error;
  };

  const submit = async (values: any, actions: any) => {
    if (!vocdoniAdminClient) return;

    setIsSubmitting(true);
    const election: IElection = {
      electionId: values.electionId,
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['one@gmail.com', 'two@gmail.com'],
        },
        {
          handler: 'oauth',
          service: 'github',
          mode: 'usernames',
          data: ['one', 'two'],
        },
      ],
    };

    // const election: IElection = {
    //   electionId: values.electionId,
    //   handlers: values.handlers,
    // };

    try {
      const res: IElectionCreated = await vocdoniAdminClient.cspElectionCreate(election);
      saveAdminToken(values.electionId, res.adminToken);
      console.log('Done with this!', res);
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <Box rounded={'lg'} bgColor={'white'} boxShadow={'lg'} p={[4, 8]} pt={[4, 6]}>
      <Heading mb={10}>Create Process</Heading>
      <Formik initialValues={{ electionId: '' }} onSubmit={submit}>
        <Form>
          <Field name="electionId" validate={validateElectionId}>
            {({ field, form }: { field: any; form: any }) => (
              <FormControl isInvalid={form.errors.electionId && form.touched.electionId}>
                <FormLabel>Election Id</FormLabel>
                <Input {...field} />
                <FormErrorMessage>{form.errors.electionId}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="handlers" validate={validateHandlers}>
            {({ field, form }: { field: any; form: any }) => (
              <FormControl isInvalid={form.errors.handlers && form.touched.handlers}>
                <FormLabel>Handlers</FormLabel>
                <Textarea {...field} />
                <FormErrorMessage>{form.errors.handlers}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
            Submit
          </Button>
        </Form>
      </Formik>
    </Box>
  );
};

export default ProcessCreate;
