import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

const LayoutContents = () => (
  <Box as="main" py={14} bgColor={'#f2f5ff'}>
    <Box maxWidth={'4xl'} margin="0 auto" paddingX={{ base: 0, sm: 4 }}>
      <Outlet />
    </Box>
  </Box>
);
export default LayoutContents;
