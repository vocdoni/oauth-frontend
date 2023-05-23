import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const LayoutHome = () => (
  <Box as="main" bgColor={'#f2f5ff'} py={10}>
    <Box maxWidth={500} margin="0 auto" paddingX={{ base: 0, sm: 4 }}>
      <Outlet />
    </Box>
  </Box>
);

export default LayoutHome;
