import {
  Box,
  Button,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useCspAdmin } from '../hooks/use-csp';
import { useState } from 'react';
import { IElection, IElectionCreated } from 'vocdoni-admin-sdk';
import GithubUserSearch from '../components/GithubUserSearch';
import { useNavigate } from 'react-router-dom';
import { useClient } from '@vocdoni/chakra-components';
import { PublishedElection } from '@vocdoni/sdk';

const ProcessCreate = () => {
  const { vocdoniAdminClient, saveAdminToken, saveElection } = useCspAdmin();
  const toast = useToast();
  const navigate = useNavigate();
  const { client } = useClient();

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [election, setElection] = useState<PublishedElection | null>();

  const validateElectionId = async (value: any) => {
    let error;
    if (!value) {
      error = 'ElectionId is required';
    }

    if (value.length == 64) {
      try {
        setElection(await client.fetchElection(value));
      } catch (err) {
        error = 'Election not found';
      }
    } else {
      error = 'ElectionId should be a 64 characters string';
    }

    if (error) setElection(null);
    return error;
  };

  const updatedGithubSelection = (users: any) => {
    setSelectedUsers(users);
  };

  const submit = async (values: any, actions: any) => {
    if (!vocdoniAdminClient) return;

    setIsSubmitting(true);

    const cspElection: IElection = {
      electionId: values.electionId,
      handlers: [
        {
          handler: 'oauth',
          service: 'github',
          mode: 'usernames',
          data: selectedUsers.map((user) => user.login),
        },
      ],
    };

    try {
      const res: IElectionCreated = await vocdoniAdminClient.cspElectionCreate(cspElection);
      saveAdminToken(values.electionId, res.adminToken);
      saveElection(values.electionId, election);

      toast({
        title: 'Process created',
        description: `Process created successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/process/${values.electionId}`);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error creating process',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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

          <Collapse in={election ? true : false} animateOpacity>
            <FormLabel mt={8}>Select Github users</FormLabel>
            <GithubUserSearch onUpdateSelection={updatedGithubSelection} showSelectedList={true} />
          </Collapse>

          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
            Create
          </Button>
        </Form>
      </Formik>
    </Box>
  );
};

export default ProcessCreate;
