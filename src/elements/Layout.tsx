import { Box, Flex, Image } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

const Layout = () => (
  <Flex direction="column" minH="100vh">
    <Box as="header" position="relative" boxShadow="3px 3px 10px gray" zIndex={10} p={5}>
      <Flex justify={'space-between'}>
        <a href="/" aria-current="page" aria-label="home">
          <Image src="/logo.svg" alt="logo" h={10} />
        </a>
        <ColorModeSwitcher />
      </Flex>
    </Box>

    <Outlet />

    <Box as="footer" mt="auto">
      <Footer mw={350} mx="auto" px={{ base: 0, sm: 4 }} />
    </Box>
  </Flex>
);

export default Layout;
