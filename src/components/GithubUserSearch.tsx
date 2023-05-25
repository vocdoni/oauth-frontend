import { Flex, FormLabel, Input, List, ListItem, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import UserCard from './UserCard';

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

    setSearchTimeout(setTimeout(searchUsername, 100));
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
    setUserList([]);
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

  const handleRemove = (user: any) => {
    setClickedUsers((prevClickedUsers) => prevClickedUsers.filter((u) => u.id !== user.id));
  };

  return (
    <>
      <Input type="text" placeholder="Search..." onChange={(e) => handleInputChange(e.target.value)} />

      {userList && userList.length > 0 && (
        <List spacing={2} maxH={500} overflow={'scroll'}>
          {userList.map((user) => (
            <ListItem key={user.id} style={{ listStyleType: 'none' }}>
              <UserCard
                size="sm"
                user={user}
                onClick={handleUserClick}
                clickedBgColor={clickedUsers.includes(user) ? 'teal.100' : 'transparent'}
              />
            </ListItem>
          ))}
        </List>
      )}

      {props.showSelectedList && clickedUsers.length > 0 && (
        <>
          <FormLabel mt={8}>Selected Github users</FormLabel>
          <List>
            <Flex>
              {clickedUsers.map((user) => (
                <ListItem key={user.id} mr={2}>
                  <UserCard user={user} size={'xs'} onRemove={handleRemove} externalLink={false} />
                </ListItem>
              ))}
            </Flex>
          </List>
        </>
      )}
    </>
  );
};

export default GithubUserSearch;
