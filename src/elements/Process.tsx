import { useNavigate, useParams } from 'react-router-dom';
import { useCspAdmin } from '../hooks/use-csp';
import { useEffect, useState } from 'react';
import { IUser } from 'vocdoni-admin-sdk';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon, DeleteIcon, RepeatIcon, SearchIcon } from '@chakra-ui/icons';
import { Field, Form, Formik } from 'formik';
import GithubUserSearch from '../components/GithubUserSearch';
import { useClient } from '@vocdoni/chakra-components';
import { PublishedElection } from '@vocdoni/sdk';

const Process = () => {
  const { id } = useParams();
  const { vocdoniAdminClient, getAdminToken } = useCspAdmin();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { client } = useClient();
  const toast = useToast();

  const [adminToken, setAdminToken] = useState<string>('');
  const [election, setElection] = useState<PublishedElection>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isSearchFilter, setIsSearchFilter] = useState<boolean>(false);

  useEffect(() => {
    (async function iife() {
      if (!vocdoniAdminClient) return;

      const adminToken = await getAdminToken(id);
      if (!adminToken) navigate('/');

      if (!election) {
        try {
          setElection(await client.fetchElection(id));
        } catch (e) {
          toast({
            title: 'Error fetching election',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/');
        }
      }

      setAdminToken(adminToken);
      refreshUsers();
    })();
  }, [vocdoniAdminClient, adminToken]);

  const refreshUsers = async () => {
    if (!adminToken) return;

    setUsers((await vocdoniAdminClient.cspUserList(adminToken, id)) || []);
  };

  const removeUser = (userId: string) => async () => {
    if (!vocdoniAdminClient || !adminToken) return;

    await vocdoniAdminClient.cspUserDelete(adminToken, id, userId);
    refreshUsers();
  };

  const toggleConsumed = (userId: string, consumed: boolean) => async () => {
    if (!vocdoniAdminClient || !adminToken) return;

    let updated: IUser = await vocdoniAdminClient.cspUserUpdate(adminToken, id, userId, {
      consumed: !consumed,
    });
    refreshUsers();
  };

  const handleSearch = async (values: any, actions: any) => {
    if (!vocdoniAdminClient || !adminToken) return;

    setIsSearchFilter(true);
    let search: IUser[] = await vocdoniAdminClient.cspUserSearch(adminToken, id, {
      data: values.search,
    });
    setUsers(search || []);
  };

  const resetSearch = async () => {
    refreshUsers();
    setIsSearchFilter(false);
  };

  const updatedGithubSelection = async (users: any) => {
    if (!vocdoniAdminClient || !adminToken) return;

    await Promise.all(
      users.map(async (user: any) => {
        try {
          await vocdoniAdminClient.cspUserCreate(adminToken, id, {
            handler: 'oauth',
            service: 'github',
            mode: 'usernames',
            data: user.login,
            consumed: false,
          });
        } catch (e) {
          console.log(e);
        }
      })
    );

    refreshUsers();
  };

  return (
    <Box rounded={'lg'} bgColor={'white'} boxShadow={'lg'} p={[4, 8]} pt={[4, 6]}>
      {election && (
        <>
          <Heading mb={5}>{election?.title.default}</Heading>
          <Box mb={7}>
            <p>{election?.description.default}</p>
          </Box>
        </>
      )}

      <Flex mt={5} gap={2}>
        <Button onClick={onOpen}>
          <AddIcon boxSize={3} color="blue.500" mr={2} />
          Add Users
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Gitub users</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <GithubUserSearch onUpdateSelection={updatedGithubSelection} />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Spacer />

        <Formik initialValues={{ search: '' }} onSubmit={handleSearch}>
          <Form>
            <Field name="search">
              {({ field, form }: { field: any; form: any }) => (
                <FormControl isInvalid={form.errors.search && form.touched.search}>
                  <InputGroup size="md">
                    <Input {...field} pr="4.5rem" />
                    <InputRightElement mr={1}>
                      {!isSearchFilter && (
                        <Button h="1.75rem" size="sm" onClick={form.handleSubmit} colorScheme={'teal'}>
                          <SearchIcon boxSize={3} color="white" />
                        </Button>
                      )}
                      {isSearchFilter && (
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={() => {
                            form.resetForm();
                            resetSearch();
                          }}
                          colorScheme={'teal'}
                        >
                          <CloseIcon boxSize={3} color="white" />
                        </Button>
                      )}
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.search}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Form>
        </Formik>
      </Flex>

      <Table mt={2}>
        <Thead>
          <Tr>
            <Th>Consumed</Th>
            <Th>Data</Th>
            {/* <Th>Handler</Th>
              <Th>Service</Th>
              <Th>Mode</Th> */}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((e: IUser) => {
            return (
              <Tr key={e.userId}>
                <Td>{e.consumed ? <CheckIcon color="green.500" /> : ''}</Td>
                <Td>{e.data}</Td>
                {/* <Td>{e.handler}</Td>
                  <Td>{e.service}</Td>
                  <Td>{e.mode}</Td> */}
                <Td>
                  <Flex justifyContent="flex-end">
                    <Button onClick={toggleConsumed(e.userId as string, e.consumed)} mr={1}>
                      <RepeatIcon boxSize={3} color="blue.500" mr={2} />
                      {e.consumed ? 'Set as not voted' : 'Set as voted'}
                    </Button>

                    <IconButton
                      aria-label="Remove"
                      icon={<DeleteIcon boxSize={3} color="red.500" />}
                      onClick={removeUser(e.userId as string)}
                    />
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Process;
