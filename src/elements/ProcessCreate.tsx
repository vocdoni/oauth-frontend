import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, useToast } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useCspAdmin } from '../hooks/use-csp';
import { useState } from 'react';
import { IElection, IElectionCreated } from 'vocdoni-admin-sdk';
import GithubUserSearch from '../components/GithubUserSearch';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';

const ProcessCreate = () => {
  const { vocdoniAdminClient, saveAdminToken } = useCspAdmin();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateElectionId = (value: any) => {
    let error;
    if (!value) {
      error = 'ElectionId is required';
    }
    return error;
  };

  const updatedGithubSelection = (users: any) => {
    setSelectedUsers(users);
  };

  const submit = async (values: any, actions: any) => {
    if (!vocdoniAdminClient) return;

    setIsSubmitting(true);

    const election: IElection = {
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
      const res: IElectionCreated = await vocdoniAdminClient.cspElectionCreate(election);
      saveAdminToken(values.electionId, res.adminToken);
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
        // description: `Error creating process: ${err?.message}`,
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

          <FormLabel mt={8}>Select Github users</FormLabel>
          <GithubUserSearch onUpdateSelection={updatedGithubSelection} showSelectedList={true} />

          <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
            Create
          </Button>
        </Form>
      </Formik>
    </Box>
  );
};

export default ProcessCreate;
