import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';
import Init from './components/Init';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Election from './components/Election';
import ElectionCreate from './components/ElectionCreate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Init />,
  },
  {
    path: '/:id',
    element: <Election />,
  },
  {
    path: '/create',
    element: <ElectionCreate />,
  },
]);

export const App = () => (
  <Grid
    templateAreas={`"header header"
                  "main main"
                  "footer footer"`}
    gridTemplateRows={'50px 1fr 30px'}
    gridTemplateColumns={'150px 1fr'}
    h="200px"
    gap="2"
    color="blackAlpha.700"
    fontWeight="bold"
  >
    <GridItem area={'header'}>
      <ColorModeSwitcher justifySelf="flex-end" />
    </GridItem>
    <GridItem paddingX={10} area={'main'}>
      <RouterProvider router={router} />
    </GridItem>
    <GridItem area={'footer'}></GridItem>
  </Grid>
);
