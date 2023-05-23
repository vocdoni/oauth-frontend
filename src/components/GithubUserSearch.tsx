import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const GithubUserSearch = ({ ...props }) => {
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [clickedUsers, setClickedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(setTimeout(searchUsername, 500));
  }, [searchQuery]);

  useEffect(() => {
    if (typeof props.onUpdateSelection === 'function') {
      props.onUpdateSelection(clickedUsers);
    }
  }, [clickedUsers]);

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
  };

  const searchUsername = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://api.github.com/search/users?q=${searchQuery}`);
      const data = await response.json();
      setUserList(data.items);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUserClick = (user: any) => {
    if (clickedUsers.includes(user)) {
      setClickedUsers((prevClickedUsers) => prevClickedUsers.filter((u) => u.id !== user.id));
    } else {
      setClickedUsers((prevClickedUsers) => [...prevClickedUsers, user]);
    }
  };

  return (
    <>
      <Input type="text" placeholder="Search..." onChange={(e) => handleInputChange(e.target.value)} />

      {userList.length > 0 && (
        <List spacing={2} maxH={500} overflow={'scroll'}>
          {userList.map((user) => (
            <ListItem key={user.id} style={{ listStyleType: 'none' }}>
              <Card
                onClick={() => handleUserClick(user)}
                style={{
                  cursor: 'pointer',
                }}
                bgColor={clickedUsers.includes(user) ? 'teal.100' : 'transparent'}
              >
                <CardHeader>
                  <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Avatar name={user.login} src={user.avatar_url} />

                      <Box>
                        <Heading size="sm">{user.login}</Heading>
                      </Box>
                    </Flex>
                    <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                      <IconButton variant="ghost" colorScheme="gray" aria-label="Profile" icon={<ExternalLinkIcon />} />
                    </a>
                  </Flex>
                </CardHeader>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default GithubUserSearch;
